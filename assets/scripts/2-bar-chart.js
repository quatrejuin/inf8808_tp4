"use strict";

/**
 * Fichier permettant de dessiner le graphique à bandes.
 */


/**
 * Crée les axes du graphique à bandes.
 *
 * @param g       Le groupe SVG dans lequel le graphique à bandes doit être dessiné.
 * @param xAxis   L'axe X.
 * @param yAxis   L'axe Y.
 * @param height  La hauteur du graphique.
 */
function createAxes(g, xAxis, yAxis, height) {
  // TODO: Dessiner les axes X et Y du graphique. Assurez-vous d'indiquer un titre pour l'axe Y.
  // Axe horizontal
    // l'Axe X
    g.append("g")
    .attr("class","x axis")
    .attr("transform","translate("+0+","+height+")")
    .call(xAxis)
    .selectAll("text")
    .attr("transform", "rotate(30)")
    .style("text-anchor", "start");
  
    // l'Axe Y
    g.append("g")
    .attr("class","y axis")
    .call(yAxis)
  
    g.append("text")
    .attr("y", 0 )
    .attr("x", 0 )
    .attr("dx", "-3em")
    .attr("dy", "-1em")
    .style("text-anchor", "start")
    .text("Nombre de trajets"); 
}

/**
 * Crée le graphique à bandes.
 *
 * @param g             Le groupe SVG dans lequel le graphique à bandes doit être dessiné.
 * @param currentData   Les données à utiliser.
 * @param x             L'échelle pour l'axe X.
 * @param y             L'échelle pour l'axe Y.
 * @param color         L'échelle de couleurs qui est associée à chacun des noms des stations de BIXI.
 * @param tip           L'infobulle à afficher lorsqu'une barre est survolée.
 * @param height        La hauteur du graphique.
 */
function createBarChart(g, currentData, x, y, color, tip, height) {
  // TODO: Dessiner les cercles à bandes en utilisant les échelles spécifiées.
  //       Assurez-vous d'afficher l'infobulle spécifiée lorsqu'une barre est survolée.
  // let listVar = []
  
  // currentData.forEach(function(d)
  // {
  //   listVar.push(currentData.destinations.count)
  // })
  var bars = g.selectAll(".bar")
                    .data(currentData.destinations)
                    .enter()
                    .append("g")
                    .attr("class", "bar")

  let margin = 10
  bars.append("rect")
      .attr("x", function(d) {
          return x(d.name)
      })
      .attr("y", function(d) {
          return y(d.count)
      })
      .attr("width", (x.range()[1]-margin*(currentData.destinations.length+1))/currentData.destinations.length)
      .attr("height", function(d) {
          return height - y(d.count);
      })
      .attr("fill", function(d) {
        return color(d.name)
    })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);;
}

/**
 * Réalise une transition entre les données actuellement utilisées et les nouvelles qui doivent être utilisées.
 *
 * @param g         Le groupe SVG dans lequel le graphique à bandes est dessiné.
 * @param newData   Les nouvelles données à utiliser.
 * @param y         L'échelle pour l'axe Y.
 * @param yAxis     L'axe Y.
 * @param height    La hauteur du graphique.
 */
function transition(g, newData, y, yAxis, height) {
  /* TODO:
   - Réaliser une transition pour mettre à jour l'axe des Y et la hauteur des barres à partir des nouvelles données.
   - La transition doit se faire en 1 seconde.
   */
  var bars = g.selectAll(".bar rect")
  .data(newData.destinations)
  .transition("newstation")
  .ease(d3.easeLinear)
  .duration(1000)
  .attr("y", function(d) {
      return y(d.count)
  })
  .attr("height", function(d) {
      return height - y(d.count);
  })

}

/**
 * Obtient le texte associé à l'infobulle.
 *
 * @param d               Les données associées à la barre survollée par la souris.
 * @param currentData     Les données qui sont actuellement utilisées.
 * @param formatPercent   Fonction permettant de formater correctement un pourcentage.
 * @return {string}       Le texte à afficher dans l'infobulle.
 */
function getToolTipText(d, currentData, formatPercent) {
  // TODO: Retourner le texte à afficher dans l'infobulle selon le format demandé.
  //       Assurez-vous d'utiliser la fonction "formatPercent" pour formater le pourcentage correctement.
  let sum = 0
  currentData.destinations.forEach(function(d){
    sum+=d.count
  })
  return ""+d.count+"("+formatPercent(d.count/sum)+")";
}
