<?php

include_once 'Database.php';

class UserCrud extends QueryExecutor
{
    // ... (existing methods)

    public function loginUser($userData)
    {
        $user = $this->getUserByEmail($userData->email, $userData->website_id);

        if ($user && password_verify($userData->password, $user['password'])) {
            // Check if 'metadata' is not empty before decoding
            $user['metadata'] = !empty($user['metadata']) ? json_decode($user['metadata']) : null;
            return $user;
        }

        return null;
    }


    public function resetPassword($userData)
    {
        $hashedPassword = password_hash($userData->newPassword, PASSWORD_DEFAULT);

        $query = "UPDATE users SET password = :password WHERE email = :email AND website_id = :websiteId";
        $params = [':password' => $hashedPassword, ':email' => $userData->email, ':websiteId' => $userData->website_id];

        $this->executeQuery($query, $params);

        return $this->getUserByEmail($userData->email, $userData->website_id);
    }
   

    public function getUserByToken($token)
    {
        $query = "SELECT * FROM users WHERE  metadata->>'$.token' = :token";
        $params = [':token' => $token];

        try {
            $result = $this->executeQuery($query, $params);
            $user = $result->fetch(PDO::FETCH_ASSOC);
            if (isset($user)) {
                $user['metadata'] = json_decode($user['metadata'], true);
            }
            return $user ? $user : null;
        } catch (PDOException $e) {
            // Handle the exception, e.g., log it or return an error response
            return null;
        }
    }
    public function updateUserInfo($userData)
    {
        $query = "UPDATE users SET name = :name, email = :email, role = :role, metadata = :metadata, slug = :slug 
                  WHERE user_id = :userId AND website_id = :websiteId";
        $params = [
            ':name' => $userData->name,
            ':email' => $userData->email,
            ':role' => $userData->role,
            ':metadata' => json_encode($userData->metadata),
            ':slug' => $this->generateSlug($userData->name, $userData->user_id),
            ':userId' => $userData->user_id,
            ':websiteId' => $userData->website_id,
        ];

        $this->executeQuery($query, $params);

        return $this->getUserById($userData->user_id, $userData->website_id);
    }

    public function getUserByEmail($email, $websiteId)
    {
        $query = "SELECT * FROM users WHERE email = :email AND website_id = :websiteId";
        $params = [':email' => $email, ':websiteId' => $websiteId];

        try {
            $result = $this->executeQuery($query, $params);
            $user = $result->fetch(PDO::FETCH_ASSOC);
            if (isset($user)) {
                $user['metadata'] = json_decode($user['metadata'], true);
            }
            return $user ? $user : null;
        } catch (PDOException $e) {
            // Handle the exception, e.g., log it or return an error response
            return $e->getMessage();
        }
    }

    public function getUserById($userId, $websiteId)
    {
        $query = "SELECT * FROM users WHERE user_id = :userId AND website_id = :websiteId";
        $params = [':userId' => $userId, ':websiteId' => $websiteId];

        try {
            $result = $this->executeQuery($query, $params);
            $user = $result->fetch(PDO::FETCH_ASSOC);
            if (isset($user)) {
                $user['metadata'] = json_decode($user['metadata'], true);
            }
            return $user ? $user : null;
        } catch (PDOException $e) {
            // Handle the exception, e.g., log it or return an error response
            return ['error' => $e->getMessage()];
        }
    }
    public function listUsers($role, $websiteId)
    {
        $query = "SELECT * FROM users WHERE role = :role and website_id = :websiteId";
        $params = [':role' => $role, ':websiteId' => $websiteId];

        try {
            $result = $this->executeQuery($query, $params);
            $user = $result->fetchAll(PDO::FETCH_ASSOC);

            return $user ? $user : null;
        } catch (PDOException $e) {
            // Handle the exception, e.g., log it or return an error response
            return null;
        }
    }

    public function confirmEmail($email, $websiteId)
    {
        $query = "UPDATE users SET confirmed = 1 WHERE email = :email AND website_id = :websiteId";
        $params = [':email' => $email, ':websiteId' => $websiteId];

        try {
            $this->executeQuery($query, $params);
            // You might want to return additional information or handle other logic here
            return true;
        } catch (PDOException $e) {
            // Handle the exception, e.g., log it or return an error response
            return false;
        }
    }
    public function registerUser($user)
    {
        // You might want to implement additional validation logic here before registering the user

        return $this->addUser($user);
    }

    private function addUser($user)
    {
        // Assuming you have an 'addUser' method in your Database class or elsewhere
        $hashedPassword = password_hash($user->password ?? "Password123", PASSWORD_DEFAULT);

        $query = "INSERT INTO users (name, email, password, role, metadata, website_id, confirmed) 
                  VALUES (:name, :email, :password, :role, :metadata, :websiteId, 0)";
        $params = [
            ':name' => $user->name,
            ':email' => $user->email,
            ':password' => $hashedPassword,
            ':role' => $user->role,
            ':metadata' => json_encode($user->metadata),
            ':websiteId' => $user->website_id,
        ];

        $this->executeQuery($query, $params);
        $lastInsertedId = $this->_conn->lastInsertId();
        $slug = $this->generateSlug($user->name, $lastInsertedId);
        $this->updateUserSlug($lastInsertedId, $slug);

        // Retrieve the newly registered user and return it
        return $this->getUserByEmail($user->email, $user->website_id);
    }


    private function generateSlug($name, $userId)
    {
        // Convert the name to a slug (lowercase and replace spaces with dashes)
        $slug = strtolower(str_replace(' ', '-', $name));
        // Append the user ID to ensure uniqueness
        $slug .= '-' . $userId;

        return $slug;
    }



    private function updateUserSlug($userId, $slug)
    {
        // Update the user with the generated slug
        $query = "UPDATE users SET slug = :slug WHERE user_id = :userId";
        $params = [':slug' => $slug, ':userId' => $userId];

        $this->executeQuery($query, $params);
    }

    function all()
    {
        $query = "
        SELECT 
            u.name,
            u.email,
            u.role,
            u.user_id ,
            u.created_at,
            COALESCE(JSON_ARRAYAGG(cd.slug), '[]') AS websites 
        FROM 
            users u
        LEFT JOIN 
            cms_data cd 
        ON 
            cd.parent_id = u.user_id
        GROUP BY 
            u.user_id
    ";

        try {
            $result = $this->executeQuery($query, []);
            $users = $result->fetchAll(PDO::FETCH_ASSOC);

            // Decode the JSON array of websites for each user
            foreach ($users as &$user) {
                $user['websites'] = json_decode($user['websites'], true);
            }

            return $users;
        } catch (PDOException $e) {
            // Handle exception, e.g., log it or return an error response
            return null;
        }
    }
}
