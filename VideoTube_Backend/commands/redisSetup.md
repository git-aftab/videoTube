# Ubuntu/Linux
sudo apt install redis-server
sudo systemctl start redis

# verify it's running
redis-cli ping  # should return PONG