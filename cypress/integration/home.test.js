describe("Home Page", () => {
  beforeEach(() => {
    cy.fixture("courses.json").as("coursesJSON"); //mock datas

    cy.server(); //start bachend server

    cy.route("/api/courses", "@coursesJSON").as("courses");

    cy.visit("/"); // Cypress visi the route of our application (need to start frontend server)
  });

  it("should display a list of courses", () => {
    cy.contains("All Courses"); // Verify if title is present

    cy.wait("@courses"); // wait the route response

    cy.get("mat-card").should("have.length", 9);
  });

  it("should display the advanced courses", () => {
    cy.get(".mat-tab-label").should("have.length", 2);

    cy.get(".mat-tab-label").last().click(); // simulate a click

    cy.get(".mat-tab-body-active mat-card-title")
      .its("length")
      .should("be.gt", 1); // simulate a click

    cy.get(".mat-tab-body-active mat-card-title")
      .first()
      .should("contain", "Angular Security Course");
  });
});
