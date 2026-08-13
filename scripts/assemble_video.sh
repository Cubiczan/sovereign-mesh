#!/bin/bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd "$DIR"

mkdir -p video_build assets public

echo "=== 1. Generating High-Res Scene Visuals ==="
python3 scripts/build_demo_video.py

echo "=== 2. Generating High-Quality Voiceover Narration ==="

# Scene 1: The Crisis (approx 32s)
say -v Daniel -r 175 -o video_build/audio_1.aiff \
"Welcome to Sovereign Mesh, the zero trust, self governing enterprise agent fleet built for the All Things Agentic Hackathon. As organizations deploy autonomous agent fleets to handle complex ERP transactions, supply chains, and cloud infrastructure, a dangerous vulnerability emerges: unbounded ambient tool execution. A single prompt injection or hallucinated parameters can trigger fraudulent financial transfers or catastrophic privilege escalation. Sovereign Mesh solves this."

# Scene 2: The Architecture (approx 35s)
say -v Daniel -r 175 -o video_build/audio_2.aiff \
"Sovereign Mesh establishes a unified enterprise control plane built on Google Cloud's Gemini Enterprise Agent Platform architecture. First, every agent is registered with explicit capability contracts in Agents dot M D. Second, our Zero Trust Re B A C Gate intercepts every tool call, verifying Google Zanzibar relationship tuples in real time. Third, high stakes actions automatically escalate to our multi agent Consensus Hardening Protocol deliberation engine."

# Scene 3: Live Attack Demo (approx 42s)
say -v Daniel -r 175 -o video_build/audio_3.aiff \
"Let's see Sovereign Mesh in action during a live attack. An initiating agent processes a compromised invoice attempting to disburse eighteen thousand five hundred dollars to an unverified off shore wire account with an embedded prompt injection. The Zero Trust Gate instantly catches the high spend ceiling and unverified vendor age, escalating to the Adversarial Council. The Challenger agent cross examines our G E A P Memory Bank, detects the fraudulent routing mismatch, and lowers the consensus score to zero point zero five. The attack is completely neutralized and rejected."

# Scene 4: Legitimate Flow (approx 35s)
say -v Daniel -r 175 -o video_build/audio_4.aiff \
"Conversely, observe a legitimate operational workflow: a routine forty two hundred dollar hardware purchase for verified vendor Apex Data Networks. Re B A C confirms permissions, Model Armor certifies zero risk tokens, and the Adversarial Challenger validates historical Memory Bank baselines. The Sovereign Adjudicator certifies consensus at zero point nine two and mints an immutable S H A two fifty six Decision Lock Certificate, generating a tamper proof audit trail."

# Scene 5: Conclusion (approx 25s)
say -v Daniel -r 175 -o video_build/audio_5.aiff \
"With Google Cloud Vertex A I, Gemini two point five, and Sovereign Mesh, enterprises no longer have to choose between agentic autonomy and rigorous security. Build fearlessly, governed completely. Thank you."

echo "=== 3. Rendering Video Clips with FFMPEG ==="

for i in 1 2 3 4 5; do
  echo "Processing Scene $i..."
  
  # Convert AIFF to WAV
  /opt/homebrew/bin/ffmpeg -y -i video_build/audio_${i}.aiff -c:a pcm_s16le video_build/audio_${i}.wav
  
  # Get audio duration in seconds
  DURATION=$(/opt/homebrew/bin/ffprobe -i video_build/audio_${i}.wav -show_entries format=duration -v quiet -of csv="p=0")
  echo "Scene $i Duration: $DURATION seconds"
  
  # Generate video clip from slide + audio with zoompan
  /opt/homebrew/bin/ffmpeg -y -loop 1 -i video_build/scene_${i}.png -i video_build/audio_${i}.wav \
    -c:v libx264 -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p -t "$DURATION" -shortest \
    video_build/clip_${i}.mp4
done

echo "=== 4. Concatenating Master Video ==="

cat << 'EOF' > video_build/concat_list.txt
file 'clip_1.mp4'
file 'clip_2.mp4'
file 'clip_3.mp4'
file 'clip_4.mp4'
file 'clip_5.mp4'
EOF

/opt/homebrew/bin/ffmpeg -y -f concat -safe 0 -i video_build/concat_list.txt -c copy assets/demo_video.mp4
cp assets/demo_video.mp4 public/demo_video.mp4

echo "=== Master Video Render Complete: assets/demo_video.mp4 ==="
ls -lh assets/demo_video.mp4
