export async function testBackendConnection() {
    const response = await fetch("http://localhost:5000/api/test");
    const data = await response.json();
    return data;
}
