# Social Media Behavioral Simulation for Psychological Research

This repository contains a full-stack, highly controlled social media simulation designed for experimental psychology research. Built with Next.js and Firebase, it allows researchers to immerse participants in a realistic social media feed, manipulate social cues (e.g., comment valence), and seamlessly capture high-resolution behavioral telemetry (dwell times, likes, shares, qualitative comments) before handing participants off to a survey platform like Qualtrics.

## 🚀 Key Features for Researchers

* **Qualtrics-Style Block Randomization:** Automatically balances condition assignments (e.g., Sympathetic, Condemning, Neutral) using a real-time "Least-Fill" algorithm, ensuring perfectly even cell sizes.
* **Invisible Bot Honeypot:** Catches automated bots using visually hidden form fields on the Consent page, flagging them in the database and safely removing them from your final dataset.
* **Platform-Agnostic ID Capture:** Automatically detects and preserves recruitment IDs from Prolific, CloudResearch Connect, and SONA, passing them safely to the final survey.
* **High-Resolution Telemetry:** Tracks exact dwell times (in milliseconds) per post, boolean flags for viewed comments, likes, and shares, distinguishing between "Focal" (experimental) and "Filler" posts.
* **Discretized Qualitative Data:** Captures typed participant comments, perfectly tracking whether they replied to the main post or directly to a specific simulated user.
* **Gaussian Engagement Simulation:** Generates realistic, randomized high-volume engagement metrics (likes, shares, total comments) to create the illusion of a highly active platform without fabricating readable text.
* **One-Click SPSS Export:** The protected Admin Dashboard generates a pre-formatted CSV and a custom `.sps` syntax file to instantly label and format your data in SPSS.

## 🗺️ The Participant Journey

1. **Consent & Intake (`/`):** Captures URL parameters (IDs), records the browser User Agent, runs the bot honeypot, and secures informed consent.
2. **Instructions & Assignment (`/instructions`):** Explains the task and silently executes the block randomizer to assign the experimental condition.
3. **Interactive Tutorial (`/tutorial`):** A single-post sandbox that teaches participants how to like, share, and comment.
4. **The Feed (`/simulation`):** The core experiment. Participants scroll through a mix of Focal and Filler posts.
5. **Post-Simulation Survey (`/survey-post`):** A brief, natively hosted survey (Likert scales, sliders) to capture immediate reactions before context switching.
6. **Qualtrics Handoff (`/redirect`):** Automatically reconstructs the URL and redirects the participant to your Qualtrics survey, appending their condition and all recruitment IDs.

## 🛠️ Tech Stack

* **Framework:** Next.js (App Router), React, TypeScript
* **Styling:** Tailwind CSS, shadcn/ui
* **Database & Auth:** Firebase (Firestore, Firebase Authentication)

---

## 🔬 Adapting the Simulation for Your Own Research

This application is designed to be easily adaptable for different research questions. Follow this guide to customize the stimuli, conditions, and data pipeline for your specific experiment.

### 1. Changing the Stimuli (Posts & Comments)

All core post content and comments are driven by data arrays.

* **Metadata & Text:** Navigate to `src/app/simulation/feed.tsx`. Locate the `STIMULUS_METADATA` object to change the names, usernames, and text bodies of the 8 posts.
* **Images:** Swap out the images in the `public/` directory (e.g., `post1.png`). If a post needs multiple images (for a grid layout), update the `POST_IMAGES` array in `feed.tsx`.
* **Comments:** Open `src/lib/simulation-data.ts`. This file contains the arrays of comments. You can map different comments to different experimental conditions (e.g., `supportive`, `condemning`, `neutral`).

### 2. Modifying Experimental Conditions

If your study does not use "Sympathetic / Condemning / Neutral":

1. Open `src/app/instructions/page.tsx`.
2. Find `const VALENCE_CONDITIONS = ["sympathetic", "condemning", "neutral"];` and update it with your exact condition names.
3. Update the mapping logic in `src/app/simulation/feed.tsx` (around line 120) to ensure the correct comment arrays load based on your new condition names.

### 3. Updating the Qualtrics Handoff

To send participants to *your* survey at the end of the simulation:

1. Open `src/app/redirect/page.tsx`.
2. Locate `const QUALTRICS_BASE_URL = "https://duke.qualtrics.com/jfe/form/YOUR_FORM_ID";` and replace it with your anonymous Qualtrics link.
3. Ensure your Qualtrics survey is set up with **Embedded Data** fields that perfectly match the appended parameters (e.g., `participantId`, `valence`, `PROLIFIC_PID`).

### 4. Updating the Admin Dashboard Export

If you add or remove posts (e.g., dropping from 8 posts down to 5), you must update the export script so your SPSS file doesn't break.

1. Open `src/app/admin/page.tsx`.
2. Locate the `exportFullData` function.
3. Update `const postIds = ['p1', 'p2', ...]` to match your total posts.
4. Update `const realPostIds = [...]` to include *only* your focal posts (the ones you want to calculate aggregate math for, like `Total_Real_DwellAvg`).
5. Adjust the SPSS syntax string at the bottom of the function to match any new column headers.

---

*Developed for rigorous behavioral data collection. Ensure IRB compliance when adapting for human-subjects research.*