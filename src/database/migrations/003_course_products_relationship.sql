ALTER TABLE courses 
ADD CONSTRAINT fk_course_product
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT;

ALTER TABLE products
ADD CONSTRAINT fk_product_course
FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;