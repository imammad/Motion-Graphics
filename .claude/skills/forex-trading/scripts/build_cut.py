# Builds public/anfaal/cut.mp4: 60 s best-of cut, colour grade, voice cleanup.
# usage: python3 scripts/anfaal/build_cut.py <raw Anfaal_video.mp4>
# Then: python3 scripts/anfaal/segment_person.py u2net_human_seg.onnx public/anfaal/cut.mp4 mask.mp4
#       ffmpeg -i public/anfaal/cut.mp4 -i mask.mp4 -filter_complex "[1:v]format=gray[m];[0:v][m]alphamerge,format=yuva420p" \
#              -an -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 6M public/anfaal/person.webm
import subprocess, sys
F = sys.argv[1]
cuts = [(0.10, 7.64), (24.10, 32.08), (40.96, 46.19), (46.41, 52.76), (59.30, 65.36),
        (69.10, 78.60), (79.10, 80.58), (108.66, 116.25), (81.08, 89.65)]
G = ("curves=all='0/0.01 0.2/0.17 0.5/0.49 0.85/0.86 1/0.97',"
     "colorbalance=rs=-0.03:bs=0.04:rm=0.04:gm=0.01:bm=-0.03,eq=contrast=1.05:saturation=1.1")
fc = []
for i, (s, e) in enumerate(cuts):
    d = e - s
    fc.append(f"[0:v]trim={s}:{e},setpts=PTS-STARTPTS[v{i}]")
    fc.append(f"[0:a]atrim={s}:{e},asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st={d-0.03:.3f}:d=0.03[a{i}]")
fc.append("".join(f"[v{i}][a{i}]" for i in range(len(cuts))) + f"concat=n={len(cuts)}:v=1:a=1[cv][ca]")
fc.append(f"[cv]{G},format=yuv420p[ov]")
fc.append("[ca]highpass=f=80,afftdn=nf=-30:nr=14:tn=1,lowpass=f=13000,"
          "acompressor=threshold=-20dB:ratio=3:attack=8:release=120:makeup=2,loudnorm=I=-14:TP=-1.5:LRA=7,aresample=48000[oa]")
subprocess.run(["ffmpeg", "-y", "-i", F, "-filter_complex", ";".join(fc), "-map", "[ov]", "-map", "[oa]",
                "-c:v", "libx264", "-crf", "16", "-r", "24", "-c:a", "aac", "-b:a", "192k", "public/anfaal/cut.mp4"], check=True)
