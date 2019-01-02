Feature: User management

  Scenario: Create new user
    When a valid user create request is made
    And the API response will include the new user
