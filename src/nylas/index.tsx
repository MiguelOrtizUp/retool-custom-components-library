import React, { useState, useEffect } from "react";
import { Retool } from "@tryretool/custom-component-support";
import { ProviderButtons } from "./ProviderButtons";
import "./nylas-auth.css";

const OAUTH_WORKER_URL = "https://your.worker.url"; // Replace with your actual Cloudflare Worker URL
// Ensure this URL is accessible and correctly set up to handle OAuth requests

export default function NylasAuthComponent() {
  const [step, setStep] = useState<"start" | "loading" | "success" | "error">("start");

  const [grantId, setGrantId] = Retool.useStateString({
    name: "grantId",
    initialValue: "",
    inspector: "hidden",
    description: "OAuth Grant ID returned from Nylas",
    label: "Grant ID"
  });

  const [email] = Retool.useStateString({
    name: "email",
    initialValue: "example@email.com", // Default email for pre-filling
    inspector: "text", // Show in Inspector so user can pass it in
    description: "User's email to pre-fill during OAuth",
    label: "User Email"
  });
  const onAuthSucceeded = Retool.useEventCallback({ name: "Auth succeeded" });

  const settings = Retool.useComponentSettings({
      defaultHeight: 6,
      defaultWidth: 5,
    });

  // Start OAuth flow
  const startAuth = (provider: "google" | "microsoft") => {
    setStep("loading");

    const authWindow = window.open(
      `${OAUTH_WORKER_URL}/start-auth?provider=${provider}&email=${encodeURIComponent(email)}`,
      "_blank",
      "width=500,height=600"
    );

    if (!authWindow) {
      setStep("error");
    }
  };

  // Listen for postMessage from the Cloudflare Worker
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      // Only handle messages from the worker and with a grant_id
      if (
        event.origin === OAUTH_WORKER_URL &&
        event.data &&
        typeof event.data === "object" &&
        "grant_id" in event.data
      ) {
        setGrantId(event.data.grant_id);
        setStep("success");
        onAuthSucceeded();
      }
      // Optionally, keep logging for debugging
      // else {
      //   console.log("Ignored postMessage event:", event);
      // }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [onAuthSucceeded]);

  // Load Roboto font for Google button
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css?family=Roboto:400,500";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div style={{ height: "100%", overflow: "hidden" }}>
      {step === "start" && (
        <ProviderButtons onAuth={startAuth} />
      )}

      {step === "loading" && (
        <div className="nylas-step-message nylas-step-message--loading">
          <span role="img" aria-label="Loading">🔄</span>
          Redirecting to authenticate...
        </div>
      )}
      {step === "success" && (
        <div className="nylas-step-message nylas-step-message--success">
          <span role="img" aria-label="Success">✅</span>
          Successfully connected!
        </div>
      )}
      {step === "error" && (
        <div className="nylas-step-message nylas-step-message--error">
          <span role="img" aria-label="Error">❌</span>
          Authentication failed. Please try again.
        </div>
      )}
    </div>
  );
}
