// https://github.com/unified-naming-convention/NamingStandard/tree/main/api/crypt

// This is really messy. Function names from the documentation will be treated
// as best practice.

type HashAlgorithm = "sha1" | "sha384" | "sha512" | "md5" | "sha256" | "sha3-224" | "sha3-256" | "sha3-512";

/**
 * Handles data encryption and decryption.
 */
declare namespace crypt {
	/**
	 * Base64 encryption and decryption.
	 */
	const base64:
		| {
				/**
				 * @alias crypt.base64decode
				 */
				decode: typeof base64decode;

				/**
				 * @alias crypt.base64encode
				 */
				encode: typeof base64encode;
		  }
		| undefined;

	/**
	 * Decodes a base64 string to a string of bytes.
	 * @param base64 The base64 string to decode.
	 * @returns The decoded string of bytes.
	 */
	function base64decode(base64: string): string;
	/**
	 * @alias crypt.base64decode
	 * @hidden
	 */
	const base64_decode: typeof base64decode | undefined;

	/**
	 * Encodes a string of bytes to a base64 string.
	 * @param bytes The string of bytes to encode.
	 * @returns The encoded base64 string.
	 */
	function base64encode(base64: string): string;
	/**
	 * @alias crypt.base64encode
	 * @hidden
	 */
	const base64_encode: typeof base64encode | undefined;

	/**
	 * Decrypts the given data using AES (ctr mode) with the key and IV. If
	 * IV is not provided, it will use the last generated IV.
	 * @param data The data to decrypt.
	 * @param key The key to use.
	 * @param iv The IV to use.
	 * @returns The decrypted data.
	 */
	function decrypt(data: string, key: string, iv?: string): string;

	/**
	 * Encrypts the given data using AES (ctr mode) with the key and IV.
	 * @param data The data to encrypt.
	 * @param key The key to use.
	 * @param iv The IV to use.
	 * @returns The encrypted data.
	 */
	function encrypt(data: string, key: string, iv?: string): string;

	/**
	 * Returns a randomly generated string of length `length`. The result is
	 * encoded in base64. Typically used for generating IVs.
	 * @param length The length of the string to generate.
	 * @returns The generated string.
	 */
	function generatebytes(length: number): string;

	/**
	 * Returns a randomly generated 256-bit encryption key. The result is
	 * encoded in base64.
	 * @returns The generated key.
	 */
	function generatekey(): string;

	/**
	 * Hashes the given data using `algorithm`. Must be able to handle NULL
	 * bytes in the result.
	 * @param data The data to hash.
	 * @param algorithm The algorithm to use.
	 * @returns The hashed data.
	 */
	function hash(data: string, algorithm: HashAlgorithm): string;
}

/**
 * Handles base64 encryption and decryption.
 * @hidden
 */
declare const base64:
	| {
			/**
			 * @alias crypt.base64decode
			 */
			decode: typeof crypt.base64decode;

			/**
			 * @alias crypt.base64encode
			 */
			encode: typeof crypt.base64encode;
	  }
	| undefined;

/**
 * @alias crypt.base64decode
 */
declare const base64_decode: typeof crypt.base64decode | undefined;

/**
 * @alias crypt.base64encode
 */
declare const base64_encode: typeof crypt.base64encode | undefined;
