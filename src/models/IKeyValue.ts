export interface IKeyValue {
  key: string; // The key or identifier for the value
  value: string; // The display value associated with the key
  [additionalProps: string]: any; // Allows for additional properties if needed
}
