CREATE OR REPLACE FUNCTION check_test_exists(pres_id INT, p_test_id INT)
RETURNS INT AS $$
DECLARE
BEGIN
    IF EXISTS
    (SELECT * FROM prescription_lab WHERE prescription_id = pres_id AND test_id = p_test_id) 
    THEN
        RETURN 1;
    ELSE
        RETURN 0;
    END IF;
END;
$$ LANGUAGE plpgsql;