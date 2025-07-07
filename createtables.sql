USE rema;
CREATE TABLE recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title TEXT,
    description TEXT,
    cooking_time VARCHAR(255),
    portions VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ingredients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT,
    ingredient TEXT,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

CREATE TABLE instructions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT,
    step_number INT,
    instruction TEXT,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(255) UNIQUE
);

CREATE TABLE recipe_categories (
    recipe_id INT,
    category_id INT,
    PRIMARY KEY (recipe_id, category_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tag VARCHAR(255) UNIQUE
);

CREATE TABLE recipe_tags (
    recipe_id INT,
    tag_id INT,
    PRIMARY KEY (recipe_id, tag_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT,
    rating DECIMAL(3,1) CHECK (rating >= 0.1 AND rating <= 5.0),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

CREATE TABLE calendar_meals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT NOT NULL,
    meal_date DATE NOT NULL,
    meal_time TIME NOT NULL,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);