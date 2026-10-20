ALTER TABLE users ADD display_name varchar(32) NULL;
UPDATE users SET display_name = 'test_display_name';
ALTER TABLE users ALTER COLUMN display_name SET NOT NULL;
