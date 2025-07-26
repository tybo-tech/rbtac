# 🚀 Start all containers
podman start rbtac-api-container rbtac-api-mysql-container rbtac-api-phpmyadmin-container

# 🛑 Stop all containers
podman stop rbtac-api-mysql-container rbtac-api-phpmyadmin-container rbtac-api-container

# 📋 Check running containers
podman ps

# 📋 Check all containers (running + exited)
podman ps -a

# 🧹 Optional: Remove containers
podman rm rbtac-api-container rbtac-api-mysql-container rbtac-api-phpmyadmin-container

# 🧼 Optional: Prune all stopped containers
podman container prune

# 📦 If using podman-compose (with podman-compose.yml)
podman-compose up        # Start all
podman-compose down      # Stop and remove all



11 admin@webake.co.za
2   admin@mayandaempire.co.za
10 admin@saprecast.co.za
1  admin@viviid.co.za
