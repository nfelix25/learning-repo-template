export type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;
function numberAsPrettyBinaryString(value: number, bitWidth = 8): string {
  return value.toString(2).padStart(bitWidth, "0");
}

export function logNumberAsPrettyBinaryString(
  value: number,
  bitWidth = 8,
): string {
  const binaryString = numberAsPrettyBinaryString(value, bitWidth);
  console.log(binaryString);
  return binaryString;
}

export function logTypedArrayAsPrettyBinaryString<T extends TypedArray>(
  typedArray: T,
): string {
  const bytes = new Uint8Array(
    typedArray.buffer,
    typedArray.byteOffset,
    typedArray.byteLength,
  );

  const binaryString = Array.from({ length: typedArray.length }, (_, index) => {
    const byteOffset = index * typedArray.BYTES_PER_ELEMENT;
    const elementBytes = bytes.subarray(
      byteOffset,
      byteOffset + typedArray.BYTES_PER_ELEMENT,
    );

    return Array.from(elementBytes, (byte) =>
      numberAsPrettyBinaryString(byte),
    ).join(" ");
  }).join(" | ");

  console.log(binaryString);
  return binaryString;
}

export function getByteIndexAndOffsetFrom8BitIndex(i: number) {
  const byteIndex = Math.floor(i / 8);
  const bitOffset = i % 8;
  return { byteIndex, bitOffset };
}
