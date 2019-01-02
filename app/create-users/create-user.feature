Feature: User management

  Scenario Outline: Create new user
    When a valid user create request is made
    Then the API response will be successful
    And the API response will include the new user
