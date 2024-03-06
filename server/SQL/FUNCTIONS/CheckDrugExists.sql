CREATE OR REPLACE FUNCTION check_drug_exists(pres_id INT, p_drug_id INT)
RETURNS INT AS $$
DECLARE
    drug_exists INT;
BEGIN
    IF EXISTS
    (SELECT * FROM prescription_drug WHERE prescription_id = pres_id AND drug_id = p_drug_id) 
    THEN
        drug_exists := 1;
    ELSE
        drug_exists := 0;
    END IF;
    RETURN drug_exists;
END;
$$ LANGUAGE plpgsql;