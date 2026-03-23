/**
 * Keyboard.js
 *
 * Renders a piano-style keyboard from Contentful KeyboardKey data.
 * White keys are shown as a flex row; black keys are absolutely positioned on top.
 *
 * Props:
 *   keys  – array of Contentful KeyboardKey nodes
 *           [{ keyId: "C", assignedNote: "C4", octave: 4 }, ...]
 */

import React from "react"
import { navigate } from "gatsby"
import * as Tone from "tone"
import "./Keyboard.css"

// ---------- constants ----------

// Notes that are "black" keys on a piano
const BLACK_KEY_NAMES = new Set(["C#", "D#", "F#", "G#", "A#"])

// Chromatic order within one octave (used for sorting)
const CHROMATIC_ORDER = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

// For each black key, which white-key index it sits *after* (0-based)
// C(0) D(1) E(2) F(3) G(4) A(5) B(6)
// C# sits after C (index 0), D# after D (index 1), etc.
const BLACK_KEY_AFTER_WHITE = {
  "C#": 0,
  "D#": 1,
  "F#": 3,
  "G#": 4,
  "A#": 5,
}

// ---------- helpers ----------

/**
 * Sort keys chromatically within each octave so they render left→right.
 */
function sortKeys(keys) {
  return [...keys].sort((a, b) => {
    const octA = a.octave ?? 4
    const octB = b.octave ?? 4
    if (octA !== octB) return octA - octB
    return CHROMATIC_ORDER.indexOf(a.keyId) - CHROMATIC_ORDER.indexOf(b.keyId)
  })
}

/**
 * Group an array of keys by octave.
 * Returns an array of { octave, keys } sorted by octave number.
 */
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

// ---------- audio (Tone.js) ----------

let synth = null

/**
 * Lazily create a single Synth instance so we reuse it across clicks.
 * Tone.start() must be called from a user gesture (click) before
 * the AudioContext will resume — Tone handles this automatically here.
 */
function getSynth() {
  if (!synth) synth = new Tone.Synth().toDestination()
  return synth
}

/**
 * Play a single note, e.g. "C4", "D#3".
 * Tone.start() resumes the AudioContext after the first user interaction.
 */
function playNote(assignedNote) {
  Tone.start().then(() => {
    getSynth().triggerAttackRelease(assignedNote, "8n")
  })
}

// ---------- sub-components ----------

/**
 * Renders one octave group.
 * White keys are flex children; black keys are absolutely positioned on top.
 */
function OctaveGroup({ octave, keys }) {
  const whiteKeys = keys.filter(k => !BLACK_KEY_NAMES.has(k.keyId))
  const blackKeys = keys.filter(k => BLACK_KEY_NAMES.has(k.keyId))

  /**
   * Calculate the left offset (%) for a black key.
   * Each white key takes 1/whiteKeys.length of the container width.
   * A black key is centred at the *right edge* of the white key it follows.
   *
   * Formula:
   *   whiteKeyWidth  = 100 / whiteCount  (%)
   *   centreX        = (afterIndex + 1) * whiteKeyWidth
   *   blackKeyWidth  = whiteKeyWidth * 0.6
   *   left           = centreX - blackKeyWidth / 2
   */
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
      {/* ---- white keys ---- */}
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

      {/* ---- black keys (layered on top via absolute position) ---- */}
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

// ---------- main component ----------

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
