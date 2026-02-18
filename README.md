# Firebase Studio

This is a NextJS project built in Firebase Studio.

# Social Media Simulation Framework

A high-fidelity, web-based simulation of a social media feed designed for psychological research. This framework allows researchers to study user engagement, behavioral responses, and psychological perceptions in a controlled, platform-agnostic environment.

## Key Features
* **Gaussian Social Proof**: Uses a Box-Muller transform to generate unique, realistic engagement counts (likes/reposts) for every participant.
* **Platform Agnostic ID Capture**: Built-in support for CloudResearch Connect, Prolific, and SONA ID passing via URL parameters.
* **Refresh Protection**: Implements a hydration fix to maintain participant progress and interaction states (likes/shares) even if the browser is refreshed.
* **Automated Condition Assignment**: Randomly assigns participants to "Sympathetic," "Condemning," or "Neutral" conditions at the point of instructions.

## Researcher Parameters
Researchers can adapt this simulation for their own aims by modifying the following parameters:

### 1. Engagement Distribution (`/src/app/instructions/page.tsx`)
Modify the `generateGaussian` parameters to simulate different levels of "viral" vs. "low-engagement" environments:
- **Mean**: Average number of likes/reposts.
- **StdDev**: How much variety there is in the engagement counts.
- **Min/Max**: The floor and ceiling for engagement numbers.

### 2. Experimental Stimuli (`/src/lib/simulation-data.ts`)
Add or modify posts and comments here. You can define specific "Supportive," "Condemning," or "Neutral" comment pools that will be displayed based on the user's assigned condition.

### 3. Tutorial Content (`/src/components/feed.tsx`)
Change the `isTutorial` block content to ensure the practice phase is neutral relative to your specific research question (e.g., the current "Sun-Dried Tomato" recipe).

### 4. Redirect Destination (`/src/app/redirect/page.tsx`)
Update the `QUALTRICS_BASE_URL` constant to your specific survey link to ensure all captured IDs and the assigned condition (`valence`) are passed back to your dataset.

## Deployment
This project is set up for continuous deployment via GitHub. Pushing to the `master` branch triggers an automatic build to the live environment.
