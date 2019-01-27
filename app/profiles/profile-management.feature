Feature: Profile management

  Scenario: Exclude user
    Given a valid user exists
    And a valid create and join request is made
    And another valid user exists
    And a valid join request is made
    When a valid exclude user request is made
    Then the API response will include the exclusion
  
  Scenario: Update profile
    Given a valid user exists
    And a valid create and join request is made
    When a valid update profile request is made
    Then the API response will include the updated profile information
