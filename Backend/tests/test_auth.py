def test_login_success(client):
    response = client.post("/api/auth/login", json={"email": "admin@test.local", "password": "Admin123!"})
    assert response.status_code == 200
    body = response.json()
    assert body["token_type"] == "bearer"
    assert body["user"]["role"] == "admin"


def test_tasks_require_auth(client):
    response = client.get("/api/tasks/")
    assert response.status_code in (401, 403)


def test_task_pagination_envelope(client):
    token = None
    login = client.post("/api/auth/login", json={"email": "admin@test.local", "password": "Admin123!"})
    token = login.json()["access_token"]
    response = client.get("/api/tasks/?page=1&limit=20", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    body = response.json()
    assert "items" in body
    assert body["total"] >= 1
    assert body["page"] == 1
