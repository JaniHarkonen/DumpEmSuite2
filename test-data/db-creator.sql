	/* DROPS */
DROP TABLE metadata;
DROP TABLE scraper;
DROP TABLE company;
DROP TABLE currency;
DROP TABLE color_code;
DROP TABLE company_profile;
DROP TABLE filteration_step;
DROP TABLE filteration;
DROP TABLE fundamental;
DROP TABLE macro_sector;
DROP TABLE macro_analysis;


	/* Workspace metadata */
CREATE TABLE metadata (
	dump_em_suite_version TEXT NOT NULL,
	workspace_id TEXT NOT NULL,
	workspace_name TEXT NOT NULL
);


	/* Workspace scraper configuration */
CREATE TABLE scraper (
	scraper_name TEXT,
	scraper_version TEXT,
	scrape_script_version TEXT,
	goodForDate TEXT
);


	/* Company listings available on the workspace */
CREATE TABLE company (
	company_id INT NOT NULL,
	company_name TEXT,
	stock_ticker TEXT,
	stock_price REAL,
	volume_price REAL,
	volume_quantity REAL,
	scrape_date TEXT,
	fk_company_currency_id TEXT,
	
	PRIMARY KEY (company_id),
	FOREIGN KEY (fk_company_currency_id) REFERENCES currency(currency_id)
);


	/* Available currencies */
CREATE TABLE currency (
	currency_id TEXT NOT NULL,
	
	PRIMARY KEY (currency_id)
);


	/* Available set of color codes on each analysis tab */
CREATE TABLE color_code (
	code_id INT NOT NULL,
	code_hex TEXT NOT NULL,
	
	PRIMARY KEY (code_id)
);


	/* Company profiles */
CREATE TABLE profile (
	sector TEXT,
	presence TEXT,
	investors_url TEXT,
	profile_description TEXT,
	fk_profile_company_id INT NOT NULL,
	
	FOREIGN KEY (fk_profile_company_id) REFERENCES company(company_id)
);


	/* Filteration tabs in the order that they should appear in the app */
CREATE TABLE filteration_step (
	step_id TEXT NOT NULL,
	caption TEXT, 
	fk_previous_step_id TEXT,
	
	FOREIGN KEY (fk_previous_step_id) REFERENCES filteration_step(step_id)
);


	/* Company analyses paired with the filteration steps that they appear in */
CREATE TABLE filteration (
	notes TEXT,
	fk_filteration_step_id TEXT NOT NULL,
	fk_filteration_company_id INT NOT NULL,
	fk_filteration_code_id INT NOT NULL DEFAULT 0,
	
	FOREIGN KEY (fk_filteration_step_id) REFERENCES filteration_step(step_id),
	FOREIGN KEY (fk_filteration_company_id) REFERENCES company(company_id),
	FOREIGN KEY (fk_filteration_code_id) REFERENCES color_code(code_id)
);


	/* Fundamental analyses */
CREATE TABLE fundamental (
	notes TEXT,
	fk_fundamental_company_id INT NOT NULL,
	fk_fundamental_code_id INT NOT NULL DEFAULT 0,
	
	FOREIGN KEY (fk_fundamental_company_id) REFERENCES company(company_id),
	FOREIGN KEY (fk_fundamental_code_id) REFERENCES color_code(code_id)
);


	/* Macro sector tabs in the order that they appear in the Macro-module */
CREATE TABLE macro_sector (
	sector_id TEXT NOT NULL,
	sector_name TEXT NOT NULL,
	
	PRIMARY KEY (sector_id)
);


	/* Macro analyses (TO BE COMPLETED) */
CREATE TABLE macro_analysis (
	fk_macro_analysis_sector_id TEXT NOT NULL,
	
	FOREIGN KEY (fk_macro_analysis_sector_id) REFERENCES macro_sector(sector_id)
);


	/* INSERTS */
INSERT INTO metadata (dump_em_suite_version, workspace_id, workspace_name)
VALUES
('v2.0.0', 'test-workspace', 'Testing');

INSERT INTO currency (currency_id)
VALUES 
('EUR'),
('USD');

INSERT INTO scraper (scraper_name, scraper_version, scrape_script_version, goodForDate)
VALUES
('test scrape', 'v1.0.0', 'v3.3.3', '2000-02-02');

INSERT INTO company (company_id, company_name, stock_ticker, stock_price, volume_price, volume_quantity, fk_company_currency_id, scrape_date)
VALUES
(1, 'Pizza place', 'PZZA', 50.0, 50000.00, 1000, 'EUR', '2028-01-01'),
(2, 'Big bank', 'BANK', 100.0, 100000.00, 1000, 'EUR', '2028-01-01'),
(3, 'IT', 'IT', 1.0, 10000.00, 10000, 'USD', '2028-01-01'),
(4, 'Steel Co', 'STL', 11.0, 11000.00, 1000, 'USD', '2028-01-01'),
(5, 'Coke of cola', 'CC', 20.0, 2000.00, 100, 'EUR', '2028-01-01'),
(6, 'Pep of si', 'PEP', 20.0, 2000.00, 100, 'EUR', '2028-01-01'),
(7, 'Railroad', 'ROAD', 5.0, 5000.00, 1000, 'USD', '2028-01-01');

INSERT INTO color_code (code_id, code_hex)
VALUES
(0, 'BCBCBC'),
(1, 'FF0000'),
(2, '00FF00'),
(3, '0000FF');


	/* DESCRIPTIONS GENERATED VIA CHATGPT */
INSERT INTO profile (fk_profile_company_id, sector, presence, investors_url, profile_description)
VALUES
(1, 'Hospitality', 'Finland, Sweden', 'investors.pzza.not.a.link', 'Pizza Place serves delicious, handcrafted pizzas with fresh ingredients in a cozy, family-friendly setting. Delivery and takeout available.'),
(2, 'Banking', 'Finland', 'investors.bank.not.a.link', 'Big Bank offers comprehensive financial services, including savings, loans, and investments, with a focus on customer trust and convenience.'),
(3, 'Information technology', 'Sweden, Norway, Finland', 'investors.it.not.a.link', 'IT provides expert technology solutions, specializing in software development, IT support, and cybersecurity, ensuring businesses stay secure and efficient.'),
(4, 'Industrials', 'Sweden, Norway, Finland', 'investors.stl.not.a.link', 'Steel Co manufactures high-quality steel products for construction, industrial, and commercial use, delivering strength, durability, and reliability.'),
(5, 'Food & drink', 'Sweden, Norway, Finland, USA', 'investors.cc.not.a.link', 'Coke of Cola offers refreshing, world-famous soft drinks with a variety of flavors, bringing happiness and refreshment to every sip.'),
(6, 'Food & drink', 'Sweden, USA', 'investors.pep.not.a.link', 'Pep of Si offers energizing beverages and snacks, delivering bold flavors and a refreshing boost to keep you going all day.'),
(7, 'Railroad', 'USA', 'investors.road.not.a.link', 'Railroad provides reliable, efficient transportation services, connecting cities and industries with fast, safe, and sustainable rail solutions.');
