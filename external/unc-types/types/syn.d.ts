/// <reference path="cache.d.ts" />
/// <reference path="environment.d.ts" />
/// <reference path="misc.d.ts" />

// https://x.synapse.to/docs

// Aliases

declare const getsynasset: typeof getcustomasset | undefined;

declare namespace syn {
	const cache_replace: typeof cache.replace;
	const cache_invalidate: typeof cache.invalidate;
	const set_thread_identity: typeof setidentity;
	const get_thread_identity: typeof getthreadidentity;
	const is_cached: typeof cache.iscached;
	const write_clipboard: typeof setclipboard;
	const queue_on_teleport: typeof queueonteleport;
	const request: typeof http_request;
}

// Signatures

declare namespace syn {
	function protect_gui(object: GuiObject): void;
	function unprotect_gui(object: GuiObject): void;
	function is_beta(): boolean;
	function secure_call<T extends Callback>(
		fn: T,
		caller:
			| LocalScript
			| ModuleScript
			| {
					Script: LocalScript | ModuleScript;
					Environment?: Record<string, unknown>;
					LineNumber?: number;
			  },
		...args: Parameters<T>
	): ReturnType<T>;
	function create_secure_function(code: string): Callback;
	function run_secure_function<T = unknown>(code: string): T;
}

// Libraries

declare namespace syn {
	namespace crypt {
		namespace base64 {
			function encode(data: string): string;
			function decode(data: string): string;
		}

		namespace custom {
			type Cipher =
				| "aes-cbc"
				| "aes-cfb"
				| "aes-ctr"
				| "aes-ofb"
				| "aes-gcm"
				| "aes-eax"
				| "bf-cbc"
				| "bf-cfb"
				| "bf-ofb";

			type Algorithm =
				| "md5"
				| "sha1"
				| "sha224"
				| "sha256"
				| "sha384"
				| "sha512"
				| "sha3-256"
				| "sha3-384"
				| "sha3-512";

			function encrypt(cipher: Cipher, data: string, key: string, iv: string): string;
			function decrypt(cipher: Cipher, data: string, key: string, iv: string): string;
			function hash(algorithm: Algorithm, data: string): string;
		}

		function encrypt(data: string, key: string): string;
		function decrypt(data: string, key: string): string;
		function hash(data: string): string;
		function random(size: number): string;
	}

	const crypto: typeof crypt;
}
