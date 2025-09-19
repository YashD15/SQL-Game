def suggest_investments(monthly_savings: float, category: str):
    """
    Suggest investment allocation based on user's category.
    Categories supported:
    - "low_income_high_debt"
    - "young_professional"
    - "family_focused"
    - "high_income_experienced"
    - "senior_retired"
    """

    # Allocation rules (percentages must sum to 100)
    allocations = {
        "low_income_high_debt": {
            "Savings Account": 40,
            "FD/RD": 40,
            "PPF/EPF/SSY": 20,
            "Gold": 0,
            "Mutual Funds": 0,
            "Stocks": 0
        },
        "young_professional": {
            "Savings Account": 5,
            "FD/RD": 15,
            "PPF/EPF/SSY": 20,
            "Gold": 10,
            "Mutual Funds": 45,
            "Stocks": 5
        },
        "family_focused": {
            "Savings Account": 10,
            "FD/RD": 25,
            "PPF/EPF/SSY": 30,
            "Gold": 10,
            "Mutual Funds": 20,
            "Stocks": 5
        },
        "high_income_experienced": {
            "Savings Account": 5,
            "FD/RD": 10,
            "PPF/EPF/SSY": 5,
            "Gold": 10,
            "Mutual Funds": 50,
            "Stocks": 20
        },
        "senior_retired": {
            "Savings Account": 20,
            "FD/RD": 50,
            "PPF/EPF/SSY": 20,
            "Gold": 10,
            "Mutual Funds": 0,
            "Stocks": 0
        }
    }

    if category not in allocations:
        raise ValueError(f"Category '{category}' not supported.")

    category_alloc = allocations[category]

    result = {}
    for domain, percent in category_alloc.items():
        result[domain] = {
            "percentage": percent,
            "amount": round((monthly_savings * percent) / 100, 2)
        }

    return result


# -------------------------------
# Test cases
# -------------------------------
if __name__ == "__main__":
    # Test 1: Low income + high debt
    print("Test 1: Low income high debt, savings ₹20,000")
    print(suggest_investments(20000, "low_income_high_debt"))

    # Test 2: Young professional
    print("\nTest 2: Young professional, savings ₹60,000")
    print(suggest_investments(60000, "young_professional"))

    # Test 3: High income experienced
    print("\nTest 3: High income experienced, savings ₹200,000")
    print(suggest_investments(200000, "high_income_experienced"))
