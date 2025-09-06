CREATE VIRTUAL TABLE projects_fts USING fts5(id UNINDEXED, name, description);
--> statement-breakpoint

INSERT INTO projects_fts(id, name, description)
SELECT id, name, description FROM projects;
--> statement-breakpoint

CREATE TRIGGER projects_after_insert AFTER INSERT ON projects BEGIN
  INSERT INTO projects_fts(id, name, description) VALUES (new.id, new.name, new.description);
END;
--> statement-breakpoint

CREATE TRIGGER projects_after_update AFTER UPDATE ON projects WHEN new.name IS NOT old.name OR new.description IS NOT old.description BEGIN
  UPDATE projects_fts SET name = new.name, description = new.description WHERE id = new.id;
END;
--> statement-breakpoint

CREATE TRIGGER projects_after_delete AFTER DELETE ON projects BEGIN
  DELETE FROM projects_fts WHERE id = old.id;
END;
