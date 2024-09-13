package utils

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"log"

	"golang.org/x/crypto/argon2"
)

// HashPassword hashes a given password using Argon2 and returns the hashed string.
func HashPassword(password string) (string, error) {
	// Define parameters for Argon2
	const (
		time    = 1
		memory  = 64 * 1024
		threads = 4
		keyLen  = 32
		saltLen = 16
	)

	// Generate a random salt
	salt := make([]byte, saltLen)
	_, err := rand.Read(salt)
	if err != nil {
		return "", fmt.Errorf("failed to generate salt: %w", err)
	}

	// Hash the password with the salt using Argon2id
	hash := argon2.IDKey([]byte(password), salt, time, memory, uint8(threads), keyLen)

	// Encode the salt and hash to base64 for storage
	saltBase64 := base64.RawStdEncoding.EncodeToString(salt)
	hashBase64 := base64.RawStdEncoding.EncodeToString(hash)

	// Return the formatted hash string
	return fmt.Sprintf("%s$%s$%s", saltBase64, hashBase64, "argon2id"), nil
}

func hashKey(password string) (string, error) {
	hashedPassword, err := HashPassword(password)
	if err != nil {
		log.Fatalf("Error hashing key: %v", err)
	}
	fmt.Println("Hashed key:", hashedPassword)
	return hashedPassword, nil
}