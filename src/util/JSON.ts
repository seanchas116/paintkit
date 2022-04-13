import { Transform } from "paintvec";

// Column-major affine transform
export type TransformJSON = [
  [number, number],
  [number, number],
  [number, number]
];

export function transformToJSON(transform: Transform): TransformJSON {
  return [
    [transform.m00, transform.m01],
    [transform.m10, transform.m11],
    [transform.m20, transform.m21],
  ];
}

export function transformFromJSON(json: TransformJSON): Transform {
  return new Transform(
    json[0][0],
    json[0][1],
    0,
    json[1][0],
    json[1][1],
    0,
    json[2][0],
    json[2][1],
    1
  );
}
