DROP DATABASE IF EXISTS employee_tracker_DB;

CREATE DATABASE employee_tracker_DB;

USE employee_tracker_DB;


CREATE TABLE employee_tracker_DB.department(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id));

CREATE TABLE employee_tracker_DB.role(
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  department_id INT,
  PRIMARY KEY (id)); 

CREATE TABLE employee_tracker_DB.employee(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT NULL,
  PRIMARY KEY (id)); 

INSERT INTO department(name)
VALUES ("Supplychain"),("Merchhendise"),("Digital");


INSERT INTO role(title,salary,department_id)
VALUES ("Associate",10000,1);

INSERT INTO role(title,salary,department_id)
VALUES ("Engineer",20000,2)("Senior Engineer",1111,3)("BA",3000,1)("Lead Engineer",2000,2);

INSERT INTO employee(first_name,last_name,role_id,manager_id)
VALUES ("Naveen","Dayalan",1,13);

INSERT INTO employee(first_name,last_name,role_id,manager_id)
VALUES ("KRITHI","SATHISH",4,3);

INSERT INTO employee(first_name,last_name,role_id,manager_id)
VALUES ("Devis","carmik",8);


DELETE FROM role;
DELETE from employee;
DELETE from department;


