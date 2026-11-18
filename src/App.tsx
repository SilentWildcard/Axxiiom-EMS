import React, { useState } from 'react';
import { SimulatorProvider, useSimulator } from './components/HardwareLab/SimulatorContext';
import { HardwareSimulationLab } from './components/HardwareLab/HardwareSimulationLab';
import { PoliceDeskPanel } from './components/HardwareLab/PoliceDeskPanel';
import { DelhiCorridorMiniMap } from './components/HardwareLab/DelhiCorridorMiniMap';
import { TelemetryConsole } from './components/HardwareLab/TelemetryConsole';
import { DELHI_JUNCTIONS } from './components/HardwareLab/useHardwareSimulator';
import {
  Cpu,
  Shield,
  MapPin,
  Terminal,
  FileCode,
  Github,
} from 'lucide-react';

type StandaloneView = 'lab' | 'police' | 'map' | 'telemetry' | 'firmware';

/* Inner app — consumes the shared SimulatorContext */
function AppInner() {
  const [activeView, setActiveView] = useState<StandaloneView>('lab');
  const sim = useSimulator();

  return (
    <div className="min-h-screen w-screen flex flex-col bg-[#070d18] text-slate-200 select-none font-mono">
      {/* ── TOP APPLICATION HEADER ───────────────────────────────── */}
      <header className="border-b border-slate-800 bg-[#090e1a]/95 backdrop-blur-md px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
            <Cpu size={20} className="text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-wider text-white">
                HARDWARE DIGITAL TWIN
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 tracking-widest">
                IoT LAB
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Axiom EMS • Delhi Police Intelligent Traffic Coordination Infrastructure
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-[#050912] p-1 rounded-lg border border-slate-800 text-xs">
          {[
            { id: 'lab' as const, label: 'Simulation Lab', icon: Cpu, badge: 'MASTER' },
            { id: 'police' as const, label: 'Police Desk', icon: Shield },
            { id: 'map' as const, label: 'Corridor Map', icon: MapPin },
            { id: 'telemetry' as const, label: 'Live Console', icon: Terminal },
            { id: 'firmware' as const, label: 'ESP32 Firmware', icon: FileCode },
          ].map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`px-3 py-1.5 rounded-md font-bold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon size={14} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] px-1 py-px rounded bg-black/40 text-cyan-200 font-normal">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Live System Health Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-[#080d1a] border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-400">Status:</span>
            <span className="text-emerald-300 font-bold">STAGE {sim.currentStage} ACTIVE</span>
          </div>

          <a
            href="https://github.com/SilentWildcard"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 text-xs transition-all"
            title="View on GitHub"
          >
            <Github size={15} />
          </a>
        </div>
      </header>

      {/* ── MAIN CONTENT VIEWPORT ────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* VIEW 1: MASTER HARDWARE SIMULATION LAB */}
        {activeView === 'lab' && <HardwareSimulationLab />}

        {/* VIEW 2: DEDICATED POLICE OPERATIONS DESK */}
        {activeView === 'police' && (
          <div className="p-4 md:p-6 space-y-4 max-w-7xl mx-auto w-full">
            <PoliceDeskPanel
              activeJunction={sim.activeJunction}
              onSelectJunction={sim.selectJunction}
              ambulanceDistKm={sim.activeAmbulanceDistToJunctionKm}
              etaSeconds={sim.ambulanceEtaSeconds}
              stage={sim.currentStage}
              isAcknowledged={sim.policeAcknowledged}
              onAcknowledge={() => {
                sim.setPoliceAcknowledged(true);
                sim.addLog('POLICE_DESK', 'SYSTEM', 'info', 'Delhi Police Officer acknowledged & authorized priority corridor.');
              }}
              trafficDensity={sim.config.trafficDensity}
              queueMeters={sim.currentQueueMeters}
              onSendRadioDispatch={msg => {
                sim.addLog('POLICE_DESK', 'SYSTEM', 'info', `Tactical Broadcast: ${msg}`);
              }}
            />

            <DelhiCorridorMiniMap
              selectedJunctionId={sim.selectedJunctionId}
              onSelectJunction={sim.selectJunction}
              ambulanceDistKm={sim.activeAmbulanceDistToJunctionKm}
              stage={sim.currentStage}
            />
          </div>
        )}

        {/* VIEW 3: CORRIDOR GEOSPATIAL MAP */}
        {activeView === 'map' && (
          <div className="p-4 md:p-6 space-y-4 max-w-7xl mx-auto w-full">
            <DelhiCorridorMiniMap
              selectedJunctionId={sim.selectedJunctionId}
              onSelectJunction={sim.selectJunction}
              ambulanceDistKm={sim.activeAmbulanceDistToJunctionKm}
              stage={sim.currentStage}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {DELHI_JUNCTIONS.map(j => (
                <div
                  key={j.id}
                  onClick={() => sim.selectJunction(j.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    j.id === sim.selectedJunctionId
                      ? 'bg-cyan-950/40 border-cyan-500 text-white'
                      : 'bg-[#0b1323] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">#{j.id} {j.name}</span>
                    <span className="text-[10px] text-cyan-400 font-mono">{j.rsuId}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{j.description}</p>
                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex justify-between text-[10px]">
                    <span>Lat: {j.lat.toFixed(4)}°N</span>
                    <span>Lng: {j.lng.toFixed(4)}°E</span>
                    <span className="text-emerald-400 font-bold">RSU ACTIVE</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: TELEMETRY CONSOLE FULL SCREEN */}
        {activeView === 'telemetry' && (
          <div className="p-4 md:p-6 space-y-4 max-w-7xl mx-auto w-full flex-1 flex flex-col">
            <TelemetryConsole
              logs={sim.logs}
              onClearLogs={() => sim.addLog('SERVER', 'SYSTEM', 'info', 'Console logs cleared.')}
            />
          </div>
        )}

        {/* VIEW 5: ESP32 FIRMWARE & HARDWARE SCHEMATICS */}
        {activeView === 'firmware' && (
          <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto w-full">
            <div className="bg-[#0b1323] border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <FileCode size={20} className="text-cyan-400" />
                  <div>
                    <h2 className="text-base font-extrabold text-white">
                      ESP32 ROADSIDE UNIT (RSU) NODE FIRMWARE
                    </h2>
                    <p className="text-xs text-slate-400">
                      Arduino / FreeRTOS C++ Code for Junction-Level Preemption Node (hardware/esp32_rsu_node.ino)
                    </p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-emerald-400 font-bold">
                  v2.4 PRODUCTION FIRMWARE
                </span>
              </div>

              {/* Pinout Specification Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                {[
                  { color: 'text-cyan-400', pin: 'GPIO 21 (OUTPUT)', name: 'Relay K1 (Signal Actuation)', detail: '3.3V Optocoupler Solid-State Driver' },
                  { color: 'text-amber-400', pin: 'GPIO 25/26/22 (I2S)', name: 'MAX98357A Audio DAC', detail: 'BCLK, LRC, DOUT to Horn Siren' },
                  { color: 'text-blue-400', pin: 'GPIO 18/19 (ECHO/TRIG)', name: 'HC-SR04 Transducers', detail: '40kHz Pulse Time-of-Flight Queue Sensor' },
                  { color: 'text-purple-400', pin: 'UART2 (RX2/TX2)', name: 'SIM7600 4G LTE Modem', detail: '115200 Baud AT Command & MQTT Broker' },
                ].map(item => (
                  <div key={item.pin} className="bg-[#080d1a] border border-slate-800 p-3 rounded-lg">
                    <span className={`${item.color} font-bold block mb-1`}>{item.pin}</span>
                    <span className="text-white font-bold block">{item.name}</span>
                    <span className="text-[10px] text-slate-400">{item.detail}</span>
                  </div>
                ))}
              </div>

              {/* Firmware Code Block */}
              <div className="bg-[#050912] border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[500px]">
                <pre>{`/*
 * AXIOM EMS — Roadside Unit (RSU) Node Firmware
 * Target: ESP32-WROOM-32D / Dual Xtensa LX6 @ 240MHz
 * Modules: SIM7600 4G LTE, MAX98357A I2S Horn, HC-SR04 Ultrasonic, Solid-State Relay K1
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* DEVICE_ID = "DELHI-RSU-ITO-05";
const char* MQTT_BROKER = "mqtt.delhipolice.iot.internal";
const int MQTT_PORT = 8883;

// Pin Configuration
#define STATUS_LED_PIN 2
#define RELAY_K1_PIN 21
#define I2S_BCLK 26
#define I2S_LRC  25
#define I2S_DOUT 22
#define HC_SR04_TRIG 19
#define HC_SR04_ECHO 18

void setup() {
  Serial.begin(115200);
  pinMode(STATUS_LED_PIN, OUTPUT);
  pinMode(RELAY_K1_PIN, OUTPUT);
  digitalWrite(RELAY_K1_PIN, LOW); // Normal traffic phase

  Serial.println("[RSU NODE] Initializing ESP32 Roadside Hardware Unit...");
  Serial.printf("[RSU NODE] Device ID: %s\\n", DEVICE_ID);
  
  // Connect to Delhi Police Dedicated Mesh Network
  initCellularModem();
  connectMQTT();
}

void loop() {
  // Read ultrasonic queue length
  float queueMeters = measureQueueDistance();
  
  // Poll incoming preemption MQTT packet
  checkPreemptionTopic();
  
  delay(100);
}

void activateGreenWavePreemption(int etaSeconds) {
  Serial.printf("[RSU PRIORITY] Ambulance DL-01-EMS-4402 inbound! ETA: %ds\\n", etaSeconds);
  
  // 1. Energize Relay K1 to lock green aspect on primary corridor
  digitalWrite(RELAY_K1_PIN, HIGH);
  
  // 2. Transmit warning frame to P10 LED matrix
  updateVMSDisplay("AMBULANCE APPROACHING - KEEP CLEAR");
  
  // 3. Sound dual-frequency emergency horn siren
  playSirenTone(680, 1020);
}
`}</pre>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800/80 bg-[#070d18] px-4 py-2 text-[11px] text-slate-500 flex flex-wrap items-center justify-between">
        <span>Axiom EMS • Hardware Digital Twin &amp; IoT Infrastructure Simulator</span>
        <span>Independent GitHub Repository Deployment • All Telemetry Simulated Locally</span>
      </footer>
    </div>
  );
}

/* Root export — wraps everything in the shared provider */
export default function App() {
  return (
    <SimulatorProvider>
      <AppInner />
    </SimulatorProvider>
  );
}
