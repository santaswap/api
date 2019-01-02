Feature: Group management

  Scenario: Create and join group
    When a valid user create request is made
    And a valid create and join request is made
    Then the API response will include the new group
