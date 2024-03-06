CREATE OR REPLACE FUNCTION is_bed_taken(bid INT)
RETURNS INT AS $$
DECLARE
    result INT;
BEGIN
    SELECT CASE 
        WHEN EXISTS (
            SELECT * FROM bed_taken 
            WHERE bed_id = bid AND discharge_date IS NULL AND occupying_date IS NOT NULL
        ) THEN 1 
        ELSE 0 
    END INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql;