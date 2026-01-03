/**
 * The **Encoding** library provides functions for common binary transformation operations such as Base64 and LZ4 - the **encoding**, **decoding**, **compression**, and **decompression** of data.
 * This library replaces the old `crypt` library, which has now been fully deprecated.
 * @see https://docs.sunc.su/Encoding
 */

/**
 * `base64decode` decodes a [Base64-encoded](https://en.wikipedia.org/wiki/Base64) string back into its original form.
 * @param data The Base64-encoded string to decode.
 * @returns The decoded string.
 * @example
 * const bytecode = game.HttpGet("https://api.rubis.app/v2/scrap/zuxQZuM9Tnl5MRbo/raw");
 * writefile("sound.mp3", base64decode(bytecode)); // This file should be a valid and working MP3 file.
 * @see https://docs.sunc.su/Encoding/base64decode
 */
declare function base64decode(data: string): string;

/**
 * `lz4compress` compresses a string with the [LZ4](https://en.wikipedia.org/wiki/LZ4_(compression_algorithm)) compression algorithm.
 * @param data The string to compress.
 * @returns The compressed string.
 * @example
 * const text = "Hello, world! Hello, world! Goodbye, world!";
 * print(text.length); // 43
 * print(lz4compress(text).length); // 34
 * @see https://docs.sunc.su/Encoding/lz4compress
 */
declare function lz4compress(data: string): string;

/**
 * `base64encode` encodes a string with [Base64](https://en.wikipedia.org/wiki/Base64) encoding.
 * @param data The string to encode.
 * @returns The Base64-encoded string.
 * @example
 * print(base64encode("DummyString\0\2")); // Output: RHVtbXlTdHJpbmcAAg==
 * @see https://docs.sunc.su/Encoding/base64encode
 */
declare function base64encode(data: string): string;

/**
 * `lz4decompress` decompresses a string that was encoded using the [LZ4](https://en.wikipedia.org/wiki/LZ4_(compression_algorithm)) compression algorithm back to regular data.
 * @param data The string to decompress.
 * @returns The decompressed string.
 * @example
 * const text = "Hello, world! Hello, world!";
 * const compressed = lz4compress(text);
 * print(lz4decompress(compressed)); // "Hello, world! Hello, world!"
 * @see https://docs.sunc.su/Encoding/lz4decompress
 */
declare function lz4decompress(data: string): string;
