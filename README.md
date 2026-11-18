# Axiom EMS — Hardware Digital Twin & IoT Infrastructure Simulator

> **A software-based, interactive Hardware Digital Twin simulating the physical IoT roadside units (RSUs), on-board units (OBUs), and traffic actuation infrastructure deployed across the Delhi Emergency Corridor.**

[![Deploy Hardware Digital Twin to GitHub Pages](https://github.com/SilentWildcard/Hardware-Twin/actions/workflows/deploy.yml/badge.svg)](https://github.com/SilentWildcard/Hardware-Twin/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=flat&logo=github)](https://silentwildcard.github.io/Hardware-Twin/)

---

## 1. Project Overview

Axiom EMS is an AI/ML + IoT-Based Intelligent Ambulance Traffic Coordination System engineered for Delhi, India.

This repository hosts the **Hardware Simulation Lab & Digital Twin**. Rather than presenting static diagrams or claiming connected physical hardware, it provides a high-fidelity digital twin where every microcontroller, sensor, cellular modem, traffic light relay, LED matrix, and PA siren is fully interactive, state-driven, and synchronized with a real-time simulation clock.

---

## 2. The 9 Hardware Modules

| Node | Hardware Model | Role | Simulated Inputs / Outputs |
|---|---|---|---|
| **ESP32 IoT Controller** | ESP32-WROOM-32D (Dual-Core 240MHz) | Central Roadside Unit (RSU) Node Controller | FreeRTOS tasks, CPU load, core temperature, GPIO 21 (Relay K1), incoming MQTT priority payloads. |
| **Vehicle Density Sensor** | HC-SR04 Ultrasonic + 24GHz mmWave Radar | Queue length & lane occupancy estimation | 40kHz acoustic Time-of-Flight ($58.8\,\mu\text{s/cm}$), live oscilloscope pulse waveform, vehicle counter. |
| **GPS Module** | u-blox NEO-6M GNSS + Ceramic Patch | On-board ambulance vector tracking | Live NMEA-0183 sentences (`$GPRMC`, `$GPGGA`), 11 satellites locked, HDOP $0.85$, speed in km/h. |
| **GSM / 4G Modem** | SIMCom SIM7600G-H LTE Cat-4 | Cellular cloud uplink & RSU downlink | RSSI signal strength ($-64\,\text{dBm}$), round-trip latency, AT command console (`AT+QMTPUB`, `AT+CSQ`). |
| **Traffic Signal Controller** | Axiom ITC-300 Solid-State Tri-Color | Phase transitions & emergency green wave lock | 3-aspect visor signal head (Red, Amber, Green), phase countdown, preemption decision matrix. |
| **LED Matrix VMS Display** | P10 Outdoor Dot-Matrix (64x32) | Advance driver notification sign | Dot-matrix LED grid, dynamic warnings (*"AMBULANCE APPROACHING"*, *"PRIORITY CORRIDOR ACTIVE"*). |
| **Speaker / Public Siren** | MAX98357A I2S Class-D + 100W Horn | Intersection acoustic siren | Web Audio API dual-tone synthesis ($680\,\text{Hz} / 1020\,\text{Hz}$), volume slider, Play/Stop controls ($108\,\text{dB}$). |
| **Edge Computing Device** | Raspberry Pi Compute Module 4 | Multi-sensor data fusion (Sub-$15\,\text{ms}$) | Extended Kalman Filter combining ultrasonic, radar, and vision. Clarifies Edge vs Cloud boundaries. |
| **CCTV / AI Vision Module** | Sony IMX385 Lens + Hailo-8 NPU (26 TOPS) | Optical vehicle tracking & clearance check | Synthetic 3D road scene, YOLOv8 detection boxes (`[Ambulance 0.99]`, `[Bus 0.89]`, `[Car 0.94]`). |

---

## 3. End-to-End 6-Stage Preemption Workflow

1. **Stage 1 — Normal Traffic Flow**: Regular cyclic phases across all Delhi junctions; baseline vehicle density monitoring.
2. **Stage 2 — Ambulance Detected**: GNSS 3D fix locked on ambulance `DL-01-EMS-4402`; AI route recommendation generated.
3. **Stage 3 — IoT Command Transmission**: Cloud server transmits priority payload via 4G LTE to junction ESP32 node.
4. **Stage 4 — Junction Preparation**: Queue length assessed by edge unit; traffic signal switches to GREEN; LED matrix updates; horn sounds siren.
5. **Stage 5 — Ambulance Passage**: Real-time vector tracking on the Delhi corridor map; AI vision locks onto ambulance crossing stop line.
6. **Stage 6 — Normalisation**: Clearance interval verified; amber transition restores normal NEMA/IRC signal cycle; sirens stop.

---

## 4. Interactive Control & Simulation Capabilities

- **Playback Controls**: Start, Pause, Reset, Next Stage, Previous Stage, Speed ($1\times, 2\times, 4\times$).
- **Environmental Sliders**:
  - Traffic Density: *Low*, *Normal*, *Congested*, *Gridlock*.
  - Ambulance Speed: $30$ to $90\,\text{km/h}$.
  - Cellular Network Latency: $20$ to $850\,\text{ms}$.
- **Fault Injection Suite**:
  - *Density Sensor Fault*: Simulates transducer timeout and fallback mode.
  - *4G Network Dropout*: Simulates carrier loss, packet drop, and retry timeouts.
- **Device Power Matrix**: Individual ON/OFF switches for each of the 9 hardware units.
- **Emergency Priority Override**: Single-click manual green wave dispatch for Delhi Police operators.
- **Delhi Police Operational Desk**: Real-time mission HUD, 6-junction RSU status grid (Connaught Place to LNJP Hospital), and tactical radio dispatch commands.
- **Command & Telemetry Console**: Millisecond timestamped event stream with protocol tags (`[MQTT]`, `[UART]`, `[NMEA]`, `[4G/LTE]`, `[GPIO]`, `[I2S]`).

---

## 5. Local Development

```bash
# Clone the repository
git clone https://github.com/SilentWildcard/Hardware-Twin.git
cd Hardware-Twin

# Install dependencies
npm install

# Run local development server
npm run dev

# Build for production
npm run build
```

---

## 6. GitHub Pages Deployment

This project includes a continuous deployment workflow in `.github/workflows/deploy.yml`. Whenever changes are pushed to `main`, GitHub Actions automatically builds the production bundle and deploys it to GitHub Pages.

To deploy via `gh-pages` branch manually:
```bash
npm run build
# Deploy dist folder to gh-pages branch
```

---

## 7. License & Attribution

Developed for **Axiom EMS — Intelligent Ambulance Traffic Coordination System** (Delhi, India).  
Author: [SilentWildcard](https://github.com/SilentWildcard)
