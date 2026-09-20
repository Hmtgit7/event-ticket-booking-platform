-- Curated starter seed - ~120 major cities across ~55 countries, picked for
-- broad global coverage plus deep India coverage (the initial launch
-- market). This is NOT the full GeoNames dataset. To expand it later:
-- download GeoNames' cities15000.txt (~25k cities, population >= 15,000,
-- includes lat/lng + timezone per row - https://download.geonames.org/export/dump/),
-- transform it into INSERT statements (or a one-off CSV + COPY, or a Spring
-- Boot data loader reading a bundled resource file), and add it as a new
-- Flyway migration - never edit this file after it's shipped, per Flyway's
-- immutable-migration rule.

-- India (primary launch market - kept deliberately deeper than elsewhere)
INSERT INTO cities (name, country_code, country_name, admin_name, latitude, longitude, timezone, population) VALUES
('Mumbai', 'IN', 'India', 'Maharashtra', 19.08, 72.88, 'Asia/Kolkata', 12442373),
('Delhi', 'IN', 'India', 'Delhi', 28.70, 77.10, 'Asia/Kolkata', 16787941),
('Bengaluru', 'IN', 'India', 'Karnataka', 12.97, 77.59, 'Asia/Kolkata', 8443675),
('Hyderabad', 'IN', 'India', 'Telangana', 17.39, 78.49, 'Asia/Kolkata', 6809970),
('Chennai', 'IN', 'India', 'Tamil Nadu', 13.08, 80.27, 'Asia/Kolkata', 4646732),
('Kolkata', 'IN', 'India', 'West Bengal', 22.57, 88.36, 'Asia/Kolkata', 4496694),
('Pune', 'IN', 'India', 'Maharashtra', 18.52, 73.86, 'Asia/Kolkata', 3124458),
('Ahmedabad', 'IN', 'India', 'Gujarat', 23.03, 72.59, 'Asia/Kolkata', 5570585),
('Jaipur', 'IN', 'India', 'Rajasthan', 26.91, 75.79, 'Asia/Kolkata', 3073350),
('Surat', 'IN', 'India', 'Gujarat', 21.17, 72.83, 'Asia/Kolkata', 4467797),
('Gurugram', 'IN', 'India', 'Haryana', 28.46, 77.03, 'Asia/Kolkata', 1153000),
('Noida', 'IN', 'India', 'Uttar Pradesh', 28.54, 77.39, 'Asia/Kolkata', 642381),
('Chandigarh', 'IN', 'India', 'Chandigarh', 30.73, 76.78, 'Asia/Kolkata', 1055450),
('Lucknow', 'IN', 'India', 'Uttar Pradesh', 26.85, 80.95, 'Asia/Kolkata', 3382000),
('Kochi', 'IN', 'India', 'Kerala', 9.93, 76.27, 'Asia/Kolkata', 677381),
('Panaji', 'IN', 'India', 'Goa', 15.49, 73.83, 'Asia/Kolkata', 40017),
('Indore', 'IN', 'India', 'Madhya Pradesh', 22.72, 75.86, 'Asia/Kolkata', 1994397),
('Nagpur', 'IN', 'India', 'Maharashtra', 21.15, 79.09, 'Asia/Kolkata', 2497777),
('Bhopal', 'IN', 'India', 'Madhya Pradesh', 23.26, 77.41, 'Asia/Kolkata', 1798218),
('Coimbatore', 'IN', 'India', 'Tamil Nadu', 11.02, 76.97, 'Asia/Kolkata', 1601438);

-- North America
INSERT INTO cities (name, country_code, country_name, admin_name, latitude, longitude, timezone, population) VALUES
('New York', 'US', 'United States', 'New York', 40.71, -74.01, 'America/New_York', 8804190),
('Los Angeles', 'US', 'United States', 'California', 34.05, -118.24, 'America/Los_Angeles', 3898747),
('Chicago', 'US', 'United States', 'Illinois', 41.88, -87.63, 'America/Chicago', 2746388),
('San Francisco', 'US', 'United States', 'California', 37.77, -122.42, 'America/Los_Angeles', 873965),
('Miami', 'US', 'United States', 'Florida', 25.76, -80.19, 'America/New_York', 442241),
('Las Vegas', 'US', 'United States', 'Nevada', 36.17, -115.14, 'America/Los_Angeles', 641903),
('Austin', 'US', 'United States', 'Texas', 30.27, -97.74, 'America/Chicago', 964254),
('Seattle', 'US', 'United States', 'Washington', 47.61, -122.33, 'America/Los_Angeles', 737015),
('Boston', 'US', 'United States', 'Massachusetts', 42.36, -71.06, 'America/New_York', 675647),
('Washington', 'US', 'United States', 'District of Columbia', 38.91, -77.04, 'America/New_York', 689545),
('Houston', 'US', 'United States', 'Texas', 29.76, -95.37, 'America/Chicago', 2304580),
('Atlanta', 'US', 'United States', 'Georgia', 33.75, -84.39, 'America/New_York', 498715),
('Dallas', 'US', 'United States', 'Texas', 32.78, -96.80, 'America/Chicago', 1304379),
('Orlando', 'US', 'United States', 'Florida', 28.54, -81.38, 'America/New_York', 307573),
('Toronto', 'CA', 'Canada', 'Ontario', 43.65, -79.38, 'America/Toronto', 2794356),
('Vancouver', 'CA', 'Canada', 'British Columbia', 49.28, -123.12, 'America/Vancouver', 662248),
('Montreal', 'CA', 'Canada', 'Quebec', 45.50, -73.57, 'America/Toronto', 1762949),
('Mexico City', 'MX', 'Mexico', 'Mexico City', 19.43, -99.13, 'America/Mexico_City', 9209944);

-- South America
INSERT INTO cities (name, country_code, country_name, admin_name, latitude, longitude, timezone, population) VALUES
('Sao Paulo', 'BR', 'Brazil', 'Sao Paulo', -23.55, -46.63, 'America/Sao_Paulo', 12325232),
('Rio de Janeiro', 'BR', 'Brazil', 'Rio de Janeiro', -22.91, -43.17, 'America/Sao_Paulo', 6748000),
('Buenos Aires', 'AR', 'Argentina', 'Buenos Aires', -34.60, -58.38, 'America/Argentina/Buenos_Aires', 3075646),
('Santiago', 'CL', 'Chile', 'Santiago Metropolitan', -33.45, -70.67, 'America/Santiago', 6158080),
('Bogota', 'CO', 'Colombia', 'Bogota', 4.71, -74.07, 'America/Bogota', 7412566);

-- UK & Ireland
INSERT INTO cities (name, country_code, country_name, admin_name, latitude, longitude, timezone, population) VALUES
('London', 'GB', 'United Kingdom', 'England', 51.51, -0.13, 'Europe/London', 8982000),
('Manchester', 'GB', 'United Kingdom', 'England', 53.48, -2.24, 'Europe/London', 552858),
('Birmingham', 'GB', 'United Kingdom', 'England', 52.49, -1.89, 'Europe/London', 1141816),
('Edinburgh', 'GB', 'United Kingdom', 'Scotland', 55.95, -3.19, 'Europe/London', 506520),
('Dublin', 'IE', 'Ireland', 'Leinster', 53.35, -6.26, 'Europe/Dublin', 592713);

-- Western & Central Europe
INSERT INTO cities (name, country_code, country_name, admin_name, latitude, longitude, timezone, population) VALUES
('Berlin', 'DE', 'Germany', 'Berlin', 52.52, 13.40, 'Europe/Berlin', 3677472),
('Munich', 'DE', 'Germany', 'Bavaria', 48.14, 11.58, 'Europe/Berlin', 1487708),
('Frankfurt', 'DE', 'Germany', 'Hesse', 50.11, 8.68, 'Europe/Berlin', 764104),
('Paris', 'FR', 'France', 'Ile-de-France', 48.86, 2.35, 'Europe/Paris', 2148271),
('Lyon', 'FR', 'France', 'Auvergne-Rhone-Alpes', 45.76, 4.84, 'Europe/Paris', 522250),
('Madrid', 'ES', 'Spain', 'Madrid', 40.42, -3.70, 'Europe/Madrid', 3223334),
('Barcelona', 'ES', 'Spain', 'Catalonia', 41.39, 2.17, 'Europe/Madrid', 1620343),
('Rome', 'IT', 'Italy', 'Lazio', 41.90, 12.50, 'Europe/Rome', 2872800),
('Milan', 'IT', 'Italy', 'Lombardy', 45.46, 9.19, 'Europe/Rome', 1371498),
('Amsterdam', 'NL', 'Netherlands', 'North Holland', 52.37, 4.90, 'Europe/Amsterdam', 872757),
('Zurich', 'CH', 'Switzerland', 'Zurich', 47.38, 8.54, 'Europe/Zurich', 434335),
('Vienna', 'AT', 'Austria', 'Vienna', 48.21, 16.37, 'Europe/Vienna', 1931593),
('Brussels', 'BE', 'Belgium', 'Brussels', 50.85, 4.35, 'Europe/Brussels', 1218255),
('Prague', 'CZ', 'Czechia', 'Prague', 50.08, 14.44, 'Europe/Prague', 1309000),
('Budapest', 'HU', 'Hungary', 'Budapest', 47.50, 19.04, 'Europe/Budapest', 1706851),
('Lisbon', 'PT', 'Portugal', 'Lisbon', 38.72, -9.14, 'Europe/Lisbon', 545796);

-- Nordics
INSERT INTO cities (name, country_code, country_name, admin_name, latitude, longitude, timezone, population) VALUES
('Stockholm', 'SE', 'Sweden', 'Stockholm', 59.33, 18.07, 'Europe/Stockholm', 978770),
('Oslo', 'NO', 'Norway', 'Oslo', 59.91, 10.75, 'Europe/Oslo', 697010),
('Copenhagen', 'DK', 'Denmark', 'Capital Region', 55.68, 12.57, 'Europe/Copenhagen', 660193),
('Helsinki', 'FI', 'Finland', 'Uusimaa', 60.17, 24.94, 'Europe/Helsinki', 658864);

-- Eastern Europe & Turkey
INSERT INTO cities (name, country_code, country_name, admin_name, latitude, longitude, timezone, population) VALUES
('Moscow', 'RU', 'Russia', 'Moscow', 55.76, 37.62, 'Europe/Moscow', 12615279),
('Warsaw', 'PL', 'Poland', 'Masovian', 52.23, 21.01, 'Europe/Warsaw', 1863056),
('Athens', 'GR', 'Greece', 'Attica', 37.98, 23.73, 'Europe/Athens', 664046),
('Istanbul', 'TR', 'Turkey', 'Istanbul', 41.01, 28.96, 'Europe/Istanbul', 15462452);

-- Middle East
INSERT INTO cities (name, country_code, country_name, admin_name, latitude, longitude, timezone, population) VALUES
('Dubai', 'AE', 'United Arab Emirates', 'Dubai', 25.20, 55.27, 'Asia/Dubai', 3400900),
('Abu Dhabi', 'AE', 'United Arab Emirates', 'Abu Dhabi', 24.45, 54.38, 'Asia/Dubai', 1483000),
('Riyadh', 'SA', 'Saudi Arabia', 'Riyadh', 24.71, 46.68, 'Asia/Riyadh', 7676654),
('Jeddah', 'SA', 'Saudi Arabia', 'Makkah', 21.49, 39.19, 'Asia/Riyadh', 4697000),
('Doha', 'QA', 'Qatar', 'Doha', 25.29, 51.53, 'Asia/Qatar', 1450000),
('Tel Aviv', 'IL', 'Israel', 'Tel Aviv', 32.08, 34.78, 'Asia/Jerusalem', 460613);

-- East & Southeast Asia
INSERT INTO cities (name, country_code, country_name, admin_name, latitude, longitude, timezone, population) VALUES
('Tokyo', 'JP', 'Japan', 'Tokyo', 35.68, 139.65, 'Asia/Tokyo', 13960000),
('Osaka', 'JP', 'Japan', 'Osaka', 34.69, 135.50, 'Asia/Tokyo', 2725006),
('Seoul', 'KR', 'South Korea', 'Seoul', 37.57, 126.98, 'Asia/Seoul', 9776000),
('Shanghai', 'CN', 'China', 'Shanghai', 31.23, 121.47, 'Asia/Shanghai', 24870895),
('Beijing', 'CN', 'China', 'Beijing', 39.90, 116.41, 'Asia/Shanghai', 21540000),
('Shenzhen', 'CN', 'China', 'Guangdong', 22.54, 114.06, 'Asia/Shanghai', 17494398),
('Hong Kong', 'HK', 'Hong Kong', NULL, 22.32, 114.17, 'Asia/Hong_Kong', 7481800),
('Singapore', 'SG', 'Singapore', NULL, 1.35, 103.82, 'Asia/Singapore', 5637000),
('Kuala Lumpur', 'MY', 'Malaysia', 'Kuala Lumpur', 3.14, 101.69, 'Asia/Kuala_Lumpur', 1808000),
('Bangkok', 'TH', 'Thailand', 'Bangkok', 13.76, 100.50, 'Asia/Bangkok', 10539000),
('Jakarta', 'ID', 'Indonesia', 'Jakarta', -6.21, 106.85, 'Asia/Jakarta', 10562088),
('Manila', 'PH', 'Philippines', 'Metro Manila', 14.60, 120.98, 'Asia/Manila', 1846513),
('Ho Chi Minh City', 'VN', 'Vietnam', NULL, 10.82, 106.63, 'Asia/Ho_Chi_Minh', 8993082);

-- South Asia (excluding India, seeded separately above)
INSERT INTO cities (name, country_code, country_name, admin_name, latitude, longitude, timezone, population) VALUES
('Karachi', 'PK', 'Pakistan', 'Sindh', 24.86, 67.01, 'Asia/Karachi', 16093786),
('Lahore', 'PK', 'Pakistan', 'Punjab', 31.55, 74.34, 'Asia/Karachi', 11126285),
('Dhaka', 'BD', 'Bangladesh', 'Dhaka', 23.81, 90.41, 'Asia/Dhaka', 10278000),
('Colombo', 'LK', 'Sri Lanka', 'Western', 6.93, 79.85, 'Asia/Colombo', 752993),
('Kathmandu', 'NP', 'Nepal', 'Bagmati', 27.72, 85.32, 'Asia/Kathmandu', 1442271);

-- Africa
INSERT INTO cities (name, country_code, country_name, admin_name, latitude, longitude, timezone, population) VALUES
('Cairo', 'EG', 'Egypt', 'Cairo', 30.04, 31.24, 'Africa/Cairo', 9500000),
('Johannesburg', 'ZA', 'South Africa', 'Gauteng', -26.20, 28.05, 'Africa/Johannesburg', 5782747),
('Cape Town', 'ZA', 'South Africa', 'Western Cape', -33.92, 18.42, 'Africa/Johannesburg', 4710000),
('Lagos', 'NG', 'Nigeria', 'Lagos', 6.52, 3.38, 'Africa/Lagos', 15388000),
('Nairobi', 'KE', 'Kenya', 'Nairobi', -1.29, 36.82, 'Africa/Nairobi', 4397073);

-- Oceania
INSERT INTO cities (name, country_code, country_name, admin_name, latitude, longitude, timezone, population) VALUES
('Sydney', 'AU', 'Australia', 'New South Wales', -33.87, 151.21, 'Australia/Sydney', 5312163),
('Melbourne', 'AU', 'Australia', 'Victoria', -37.81, 144.96, 'Australia/Melbourne', 5078193),
('Brisbane', 'AU', 'Australia', 'Queensland', -27.47, 153.03, 'Australia/Brisbane', 2560720),
('Perth', 'AU', 'Australia', 'Western Australia', -31.95, 115.86, 'Australia/Perth', 2141834),
('Auckland', 'NZ', 'New Zealand', 'Auckland', -36.85, 174.76, 'Pacific/Auckland', 1657000);
