#!/usr/bin/env bash
mkdir -p public/assets
curl -L "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1400&auto=format&fit=crop" -o public/assets/burna.jpg
curl -L "https://images.unsplash.com/photo-1520975687175-9e0c8d2b5d04?q=80&w=1200&auto=format&fit=crop" -o public/assets/rema.jpg
curl -L "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1200&auto=format&fit=crop" -o public/assets/asake.jpg
curl -L "https://images.unsplash.com/photo-1505685296765-3a2736de412f?q=80&w=1400&auto=format&fit=crop" -o public/assets/cover1.jpg
curl -L "https://images.unsplash.com/photo-1544148106-0c3b8403d5f4?q=80&w=1400&auto=format&fit=crop" -o public/assets/cover2.jpg
echo "Downloaded sample assets to public/assets/"
