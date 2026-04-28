/**
 * @file index.js
 * @description Barrel export for the WebSocket interview subsystem.
 * Import from this file in server.js to mount the interview WebSocket server.
 *
 * Exports:
 * - createInterviewWebSocketServer — Factory to attach WS to the HTTP server.
 * - INTERVIEW_MODES / INTERVIEW_STATES / WS_EVENTS — Shared protocol constants.
 */
const { createInterviewWebSocketServer } = require("./websocketServer");
const { INTERVIEW_MODES, INTERVIEW_STATES, WS_EVENTS } = require("./constants");

module.exports = {
  createInterviewWebSocketServer,
  INTERVIEW_MODES,
  INTERVIEW_STATES,
  WS_EVENTS,
};
