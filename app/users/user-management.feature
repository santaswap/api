Feature: User management

  Scenario: Create new user
    When a valid user create request is made
    Then the API response will include the new user
