CREATE OR REPLACE FUNCTION validate_admission() RETURNS TRIGGER AS $$
DECLARE 
    FLAG INT;
    prev_admit_date DATE;
BEGIN
    SELECT COUNT(*) INTO FLAG
    FROM bed_taken 
    WHERE  discharge_date IS NULL AND occupying_date IS NOT NULL AND in_patient_id = NEW.in_patient_id;

    IF FLAG > 0 THEN
        SELECT occupying_date INTO prev_admit_date
        FROM bed_taken 
        WHERE  discharge_date IS NULL AND occupying_date IS NOT NULL AND in_patient_id = NEW.in_patient_id;
        IF prev_admit_date = NEW.occupying_date THEN
            RAISE EXCEPTION 'Patient cannot change bed on the same day twice.';
        ELSE
            UPDATE bed_taken 
            SET discharge_date = NEW.occupying_date
            WHERE in_patient_id = NEW.in_patient_id AND discharge_date IS NULL AND occupying_date IS NOT NULL;
        END IF;
    END IF;

    IF FLAG = 0 AND NOT EXISTS (
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