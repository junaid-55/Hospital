CREATE OR REPLACE FUNCTION validate_admission() RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT *
        FROM in_patient
        WHERE in_patient_id = NEW.in_patient_id
        AND admit_date = NEW.occupying_date
    ) THEN
        RAISE EXCEPTION 'There is no doctor''s suggestion for admission on this day for the applying person.';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER admission_suggestion_check
BEFORE INSERT ON bed_taken
FOR EACH ROW
EXECUTE PROCEDURE validate_admission();