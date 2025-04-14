#!/data/data/com.termux/files/usr/bin/bash

msg=$1
if [ -z "$msg" ]; then
  echo "Masukin pesan commit, Cheisyaa!"
  exit 1
fi

git add .
git commit -m "$msg"
git push origin main
