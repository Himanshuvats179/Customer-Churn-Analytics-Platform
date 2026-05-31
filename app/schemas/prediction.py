from pydantic import BaseModel


class PredictionRequest(BaseModel):

    user_id: int

    gender: int
    SeniorCitizen: int
    Partner: int
    Dependents: int
    tenure: int
    PhoneService: int
    PaperlessBilling: int

    MonthlyCharges: float
    TotalCharges: float

    MultipleLines_No_phone_service: int
    MultipleLines_Yes: int

    InternetService_Fiber_optic: int
    InternetService_No: int

    OnlineSecurity_No_internet_service: int
    OnlineSecurity_Yes: int

    OnlineBackup_No_internet_service: int
    OnlineBackup_Yes: int

    DeviceProtection_No_internet_service: int
    DeviceProtection_Yes: int

    TechSupport_No_internet_service: int
    TechSupport_Yes: int

    StreamingTV_No_internet_service: int
    StreamingTV_Yes: int

    StreamingMovies_No_internet_service: int
    StreamingMovies_Yes: int

    Contract_One_year: int
    Contract_Two_year: int

    PaymentMethod_Credit_card_automatic: int
    PaymentMethod_Electronic_check: int
    PaymentMethod_Mailed_check: int