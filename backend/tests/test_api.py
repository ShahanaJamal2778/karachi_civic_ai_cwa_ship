import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_api_health():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "Karachi Civic AI" in data["app"]

@pytest.mark.asyncio
async def test_api_authorities_and_categories():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        auth_resp = await ac.get("/api/authorities")
        cat_resp = await ac.get("/api/categories")
    assert auth_resp.status_code == 200
    assert len(auth_resp.json()) >= 9
    assert cat_resp.status_code == 200
    assert len(cat_resp.json()) == 14

@pytest.mark.asyncio
async def test_api_analyze_and_send_flow():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Submit a Roman Urdu sewage complaint
        payload = {
            "input_type": "text",
            "text": "North Nazimabad Block H main gutter ka ganda pani sadak par beh raha hai",
            "area": "North Nazimabad"
        }
        res = await ac.post("/api/complaints/analyze", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert "complaint_id" in data
        assert data["classification"]["category"] in ["sewage", "drainage"]
        assert data["authority"]["short_name"] in ["KWSB", "KMC"]
        assert "@" in data["authority"]["email"]
        assert data["reference_id"].startswith("CWA-")
        c_id = data["complaint_id"]

        # Fetch complaint details
        get_res = await ac.get(f"/api/complaints/{c_id}")
        assert get_res.status_code == 200
        detail = get_res.json()
        assert detail["id"] == c_id
        assert len(detail["events"]) >= 5
