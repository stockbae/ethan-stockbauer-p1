import React, { useEffect } from "react"
import { navigate } from "gatsby"
import * as Tone from "tone"
import styled from "styled-components"

const KeyboardWrapper = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 16px 0 24px;
  user-select: none;
`

const OctaveWrapper = styled.div`
  position: relative;
  display: flex;
`

const WhiteKey = styled.button`
  position: relative;
  z-index: 1;
  width: 48px;
  height: 160px;
  background: #fff;
  border: 1px solid #aaa;
  border-radius: 0 0 6px 6px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 8px;
  cursor: pointer;
  &:hover { background: #e8f4ff; }
  &:active { background: #b8d4f8; }
`

const KeyLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #555;
  pointer-events: none;
`

const BlackKey = styled.button`
  position: absolute;
  z-index: 2;
  top: 0;
  width: calc(100% / 7 * 0.6);
  height: 100px;
  background: #222;
  border: 1px solid #000;
  border-radius: 0 0 4px 4px;
  cursor: pointer;
  &:hover { background: #444; }
  &:active { background: #666; }
`

const BLACK_KEY_NAMES = new Set(["C#", "D#", "F#", "G#", "A#"])

const BLACK_KEY_AFTER_WHITE = { "C#": 0, "D#": 1, "F#": 3, "G#": 4, "A#": 5 }

let synth = null

function playNote(assignedNote) {
  Tone.start().then(() => {
    if (!synth) synth = new Tone.Synth().toDestination()
    synth.triggerAttackRelease(assignedNote, "8n")
  })
}

function groupByOctave(keys) {
  const groups = {}
  keys.forEach(key => {
    const oct = key.octave ?? 4
    if (!groups[oct]) groups[oct] = []
    groups[oct].push(key)
  })
  return Object.entries(groups).sort(([a], [b]) => a - b)
}

function OctaveGroup({ keys }) {
  const whiteKeys = keys.filter(k => !BLACK_KEY_NAMES.has(k.keyId))
  const blackKeys = keys.filter(k => BLACK_KEY_NAMES.has(k.keyId))

  function blackKeyLeft(keyId) {
    const whiteW = 100 / whiteKeys.length
    return (BLACK_KEY_AFTER_WHITE[keyId] + 1) * whiteW - (whiteW * 0.6) / 2
  }

  function handleClick(key) {
    playNote(key.assignedNote)
    navigate(`/key/${key.keyId.replace(/#/g, 's')}`)
  }

  return (
    <OctaveWrapper>
      {whiteKeys.map(key => (
        <WhiteKey key={key.keyId} onClick={() => handleClick(key)}>
          <KeyLabel>{key.keyId}</KeyLabel>
        </WhiteKey>
      ))}
      {blackKeys.map(key => (
        <BlackKey
          key={key.keyId}
          style={{ left: `${blackKeyLeft(key.keyId)}%` }}
          onClick={() => handleClick(key)}
        />
      ))}
    </OctaveWrapper>
  )
}

function Keyboard({ keys = [] }) {
  useEffect(() => {
    if (!navigator.requestMIDIAccess) return
    const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
    navigator.requestMIDIAccess().then(midi => {
      midi.inputs.forEach(input => {
        input.onmidimessage = ({ data }) => {
          const [status, note, velocity] = data
          if (status === 144 && velocity > 0) {
            playNote(`${NOTE_NAMES[note % 12]}${Math.floor(note / 12) - 1}`)
          }
        }
      })
    })
  }, [])

  return (
    <KeyboardWrapper>
      {groupByOctave(keys).map(([octave, octaveKeys]) => (
        <OctaveGroup key={octave} keys={octaveKeys} />
      ))}
    </KeyboardWrapper>
  )
}

export default Keyboard
