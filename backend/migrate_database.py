#!/usr/bin/env python3
"""
Database migration script to handle username field changes.
This script updates existing users with NULL usernames to have a default username.
Works with both SQLite and MySQL databases.
"""

import os
import sys
from sqlalchemy import create_engine, text
from config import settings

def migrate_username():
    """Migrate existing users to have usernames"""
    try:
        # Create database engine
        engine = create_engine(settings.database_url)
        
        with engine.connect() as conn:
            # Check if users table exists and has username column
            result = conn.execute(text("""
                SELECT COUNT(*) as count 
                FROM information_schema.columns 
                WHERE table_name = 'users' AND column_name = 'username'
            """))
            
            # For SQLite, use different query
            if 'sqlite' in settings.database_url:
                result = conn.execute(text("""
                    SELECT COUNT(*) as count 
                    FROM pragma_table_info('users') 
                    WHERE name = 'username'
                """))
            
            if result.fetchone()[0] == 0:
                print("Username column doesn't exist. Creating tables...")
                # Import and create tables
                from database import Base
                Base.metadata.create_all(bind=engine)
                print("Tables created successfully!")
                return
            
            # Check if there are users with NULL usernames
            if 'sqlite' in settings.database_url:
                result = conn.execute(text("SELECT id, email FROM users WHERE username IS NULL"))
            else:
                result = conn.execute(text("SELECT id, email FROM users WHERE username IS NULL"))
            
            users_without_username = result.fetchall()
            
            if not users_without_username:
                print("No users found with NULL usernames. Migration not needed.")
                return
            
            print(f"Found {len(users_without_username)} users without usernames. Updating...")
            
            # Update each user with a default username based on their email
            for user_id, email in users_without_username:
                # Extract username from email (part before @)
                base_username = email.split('@')[0]
                
                # Clean the username to match our validation rules
                import re
                clean_username = re.sub(r'[^a-zA-Z0-9_]', '', base_username)
                
                # Ensure minimum length
                if len(clean_username) < 3:
                    clean_username = clean_username + "123"
                
                # Ensure maximum length
                if len(clean_username) > 20:
                    clean_username = clean_username[:20]
                
                # Check if username already exists and add suffix if needed
                original_username = clean_username
                counter = 1
                while True:
                    if 'sqlite' in settings.database_url:
                        result = conn.execute(text("SELECT id FROM users WHERE username = :username"), 
                                            {"username": clean_username})
                    else:
                        result = conn.execute(text("SELECT id FROM users WHERE username = :username"), 
                                            {"username": clean_username})
                    
                    if not result.fetchone():
                        break
                    clean_username = f"{original_username}{counter}"
                    counter += 1
                
                # Update the user with the new username
                conn.execute(text("UPDATE users SET username = :username WHERE id = :user_id"), 
                           {"username": clean_username, "user_id": user_id})
                print(f"Updated user {user_id} ({email}) with username: {clean_username}")
            
            # Commit the changes
            conn.commit()
            print("Migration completed successfully!")
            
    except Exception as e:
        print(f"Error during migration: {e}")
        print(f"Database URL: {settings.database_url}")
        sys.exit(1)

if __name__ == "__main__":
    migrate_username()
