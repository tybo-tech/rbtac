// Test script to verify number summary calculation
// This simulates how the ViewService processes the Turn Over data

const collectionData = [
    { id: 2, collection_id: 1, data: { "1751862448933": 1000 } },
    { id: 3, collection_id: 1, data: { "1751862448933": 2000 } },
    { id: 4, collection_id: 1, data: { "1751862448933": 3000 } },
    { id: 5, collection_id: 1, data: { "1751862448933": 82220 } },
    { id: 6, collection_id: 1, data: { "1751862448933": 5000 } },
    { id: 7, collection_id: 1, data: { "1751862448933": 5220 } },
    { id: 8, collection_id: 1, data: { "1751862448933": 2000 } },
    { id: 9, collection_id: 1, data: { "1751862448933": 3000 } },
    { id: 19, collection_id: 1, data: { "1751862448933": "3000000" } }, // String number
    { id: 20, collection_id: 1, data: { "1751862448933": "3000000" } }, // String number
    { id: 21, collection_id: 1, data: { "1751862448933": 3000001 } }
];

const fieldId = "1751862448933";

// Extract numeric values (simulating getNumericValues)
const values = collectionData
    .map(row => row.data[fieldId])
    .filter(v => v !== undefined && v !== null)
    .map(v => Number(v))
    .filter(n => !isNaN(n));

console.log("Extracted values:", values);

// Calculate statistics
const total = values.reduce((sum, val) => sum + val, 0);
const min = Math.min(...values);
const max = Math.max(...values);
const avg = total / values.length;
const count = values.length;

// Calculate median
const sortedValues = [...values].sort((a, b) => a - b);
const mid = Math.floor(sortedValues.length / 2);
const median = sortedValues.length % 2 !== 0 
    ? sortedValues[mid] 
    : (sortedValues[mid - 1] + sortedValues[mid]) / 2;

// Format numbers
function formatNumber(value) {
    if (value % 1 === 0) {
        return value.toLocaleString();
    } else {
        return value.toLocaleString(undefined, { 
            minimumFractionDigits: 0, 
            maximumFractionDigits: 2 
        });
    }
}

const numberSummary = [
    { key: 'Total Records', value: count.toString() },
    { key: 'Sum', value: formatNumber(total) },
    { key: 'Average', value: formatNumber(avg) },
    { key: 'Minimum', value: formatNumber(min) },
    { key: 'Maximum', value: formatNumber(max) },
    { key: 'Median', value: formatNumber(median) },
];

console.log("\nNumber Summary Result:");
numberSummary.forEach(item => {
    console.log(`${item.key}: ${item.value}`);
});
