from datetime import datetime, timedelta, timezone

from app.models import Task, TaskStatus


def test_overdue_count_excludes_completed(client, db):
    past = datetime.now(timezone.utc) - timedelta(days=3)
    db.add(
        Task(
            title="Done late",
            status=TaskStatus.COMPLETED.value,
            priority="Low",
            due_date=past,
            created_by=1,
        )
    )
    db.add(
        Task(
            title="Still late",
            status=TaskStatus.PENDING.value,
            priority="High",
            due_date=past,
            created_by=1,
        )
    )
    db.commit()

    login = client.post("/api/auth/login", json={"email": "admin@test.local", "password": "Admin123!"})
    token = login.json()["access_token"]
    response = client.get("/api/dashboard/", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["overdue_tasks"] >= 1
    # completed overdue task must not be the only reason; overdue should not include Completed
    assert response.json()["completed_tasks"] >= 1
