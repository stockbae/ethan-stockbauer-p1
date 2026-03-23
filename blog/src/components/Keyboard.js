import React from "react"
import { navigate } from "gatsby"
import * as Tone from "tone"
import "./Keyboard.css"

const BLACK_KEY_NAMES = new Set(["C#", "D#", "F#", "G#", "A#"])

const CHROMATIC_ORDER = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

const BLACK_KEY_AFTER_WHITE = {
  "C#": 0,
  "D#": 1,
  "F#": 3,
  "G#": 4,
  "A#": 5,
}

function sortKeys(keys) {
  return [...keys].sort((a, b) => {
    const octA = a.octave ?? 4
    const octB = b.octave ?? 4
    if (octA !== octB) return octA - octB
    return CHROMATIC_ORDER.indexOf(a.keyId) - CHROMATIC_ORDER.indexOf(b.keyId)
  })
}

function groupByOctave(keys) {
  const map = {}
  keys.forEach(key => {
    const oct = key.octave ?? 4
    if (!map[oct]) map[oct] = []
    map[oct].push(key)
  })
  return Object.entries(map)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([octave, octaveKeys]) => ({ octave: Number(octave), keys: octaveKeys }))
}

let synth = null

function getSynth() {
  if (!synth) synth = new Tone.Synth().toDestination()
  return synth
}

function playNote(assignedNote) {
  Tone.start().then(() => {
    getSynth().triggerAttackRelease(assignedNote, "8n")
  })
}

function OctaveGroup({ octave, keys }) {
  const whiteKeys = keys.filter(k => !BLACK_KEY_NAMES.has(k.keyId))
  const blackKeys = keys.filter(k => BLACK_KEY_NAMES.has(k.keyId))

  function blackKeyLeft(keyId) {
    const afterIndex = BLACK_KEY_AFTER_WHITE[keyId] ?? 0
    const whiteCount = whiteKeys.length || 7
    const whiteW = 100 / whiteCount
    const centreX = (afterIndex + 1) * whiteW
    const blackW = whiteW * 0.6
    return centreX - blackW / 2
  }

  function handleClick(key) {
    playNote(key.assignedNote)
    navigate(`/key/${encodeURIComponent(key.keyId)}`)
  }

  return (
    <div className="keyboard__octave" aria-label={`Octave ${octave}`}>
      {whiteKeys.map(key => (
        <button
          key={key.keyId}
          className="keyboard__key keyboard__key--white"
          onClick={() => handleClick(key)}
          title={`${key.keyId}${octave} → ${key.assignedNote}`}
          aria-label={`Key ${key.keyId}, plays ${key.assignedNote}`}
        >
          <span className="keyboard__key-label">{key.keyId}</span>
        </button>
      ))}

      {blackKeys.map(key => (
        <button
          key={key.keyId}
          className="keyboard__key keyboard__key--black"
          style={{ left: `${blackKeyLeft(key.keyId)}%` }}
          onClick={() => handleClick(key)}
          title={`${key.keyId}${octave} → ${key.assignedNote}`}
          aria-label={`Key ${key.keyId}, plays ${key.assignedNote}`}
        />
      ))}
    </div>
  )
}

function Keyboard({ keys = [] }) {
  if (!keys.length) {
    return (
      <p className="keyboard__empty">
        No keyboard keys found. Add <strong>KeyboardKey</strong> entries in Contentful.
      </p>
    )
  }

  const sorted = sortKeys(keys)
  const octaveGroups = groupByOctave(sorted)

  return (
    <div className="keyboard" role="group" aria-label="Musical keyboard">
      {octaveGroups.map(({ octave, keys: octaveKeys }) => (
        <OctaveGroup key={octave} octave={octave} keys={octaveKeys} />
      ))}
    </div>
  )
}

export default Keyboard
