const $encryptForm = document.getElementById("encryptForm");
const $decryptForm = document.getElementById("decryptForm");
const $encryptText = document.getElementById("encryptText");
const $decryptText = document.getElementById("decryptText");
const $encryptResult = document.getElementById("encryptResult");
const $decryptResult = document.getElementById("decryptResult");

const bufferABase64 = (buffer) => btoa(String.fromCharCode(...new Uint8Array(buffer)));
const base64ABuffer = (buffer) => Uint8Array.from(atob(buffer), (c) => c.charCodeAt(0));
const LONGITUD_SAL = 16;
const LONGITUD_VECTOR_INICIALIZACION = LONGITUD_SAL;

const keyBased = async (key, sal, iteraciones, longitud, hash, algoritmo = "AES-CBC") => {
	const encoder = new TextEncoder();
	let keyMaterial = await window.crypto.subtle.importKey(
		"raw",
		encoder.encode(key),
		{ name: "PBKDF2" },
		false,
		["deriveKey"]
	);
	return await window.crypto.subtle.deriveKey(
		{
			name: "PBKDF2",
			salt: encoder.encode(sal),
			iterations: iteraciones,
			hash,
		},
		keyMaterial,
		{ name: algoritmo, length: longitud },
		false,
		["encrypt", "decrypt"]
	);
};

const encriptar = async (key, textoPlano) => {
	const encoder = new TextEncoder();
	const sal = window.crypto.getRandomValues(new Uint8Array(LONGITUD_SAL));
	const vectorInicializacion = window.crypto.getRandomValues(
		new Uint8Array(LONGITUD_VECTOR_INICIALIZACION)
	);
	const bufferTextoPlano = encoder.encode(textoPlano);
	const clave = await keyBased(key, sal, 100000, 256, "SHA-256");
	const encrypted = await window.crypto.subtle.encrypt(
		{ name: "AES-CBC", iv: vectorInicializacion },
		clave,
		bufferTextoPlano
	);
	return bufferABase64([...sal, ...vectorInicializacion, ...new Uint8Array(encrypted)]);
};

const encryptFunction = async ($event) => {
	$event.preventDefault();
	const key = "123456789";
	if (!key) {
		return alert("No hay key para encriptar");
	}
	const text = $encryptText.value;
	if (!text) {
		return alert("No hay texto para encriptar");
	}
	const encryptedText = await encriptar(key, text);
	$encryptResult.value = encryptedText;
};

const desencriptar = async (key, encriptadoEnBase64) => {
	const decoder = new TextDecoder();
	const datosEncriptados = base64ABuffer(encriptadoEnBase64);
	const sal = datosEncriptados.slice(0, LONGITUD_SAL);
	const vectorInicializacion = datosEncriptados.slice(
		0 + LONGITUD_SAL,
		LONGITUD_SAL + LONGITUD_VECTOR_INICIALIZACION
	);
	const clave = await keyBased(key, sal, 100000, 256, "SHA-256");
	const datosDesencriptadosComoBuffer = await window.crypto.subtle.decrypt(
		{ name: "AES-CBC", iv: vectorInicializacion },
		clave,
		datosEncriptados.slice(LONGITUD_SAL + LONGITUD_VECTOR_INICIALIZACION)
	);
	return decoder.decode(datosDesencriptadosComoBuffer);
};

const decryptFunction = async ($event) => {
	$event.preventDefault();
	const password = "123456789";
	if (!password) {
		return alert("No hay contraseña");
	}
	const textoCifradoBase64 = $decryptText.value;
	if (!textoCifradoBase64) {
		return alert("No hay texto en base64");
	}
	try {
		const desencriptado = await desencriptar(password, textoCifradoBase64);
		$decryptResult.value = desencriptado;
	} catch (e) {
		$decryptResult.value =
			"Error desencriptando: " +
			e.message +
			". ¿La clave es la correcta y la información está en base64?";
	}
};

$encryptForm.onsubmit = encryptFunction;
$decryptForm.onsubmit = decryptFunction;
