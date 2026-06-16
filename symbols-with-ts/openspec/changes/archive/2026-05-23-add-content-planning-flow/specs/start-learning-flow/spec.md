## MODIFIED Requirements

### Requirement: Skill Stops At Approval Without Writing Files
The start-learning skill SHALL treat the syllabus as a draft, iterate on user feedback, and stop at approval without writing repository files.

#### Scenario: Syllabus Is Approved
- **WHEN** the user approves the syllabus
- **THEN** the skill summarizes the approved syllabus and indicates that `content-planner` is the concrete later next step without writing files.
