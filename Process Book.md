***Process Book*** 



**Digital Habits and Well-Being: Exploring the Relationships Between Sleep, Screen Time, and Stress**

**by Madison Sleppy**



**Introduction**

In today's digital world, humans are dependent on technology. Because of this, screen time is unavoidable. Many individuals, especially students and other young adults, spend several hours per day interacting with their digital devices. This project aims to explore how screen time relates to seep quality and stress levels, which are important aspects of a person's well-being. 



The goal of this project is to help the audience understand how their daily screen time habits can positively or negatively impact their health. By visualizing the relationships between these variables, this project aims to provide insights that can promote better behaviors and healthier choices. 



**Intended Audience**

The intended audience for this project is students, along with young adults. This group serves as the intended audience because they are more likely to have higher screen time, along with irregular sleep patterns. The visualizations are designed with a general audience in mind, so that readers without technical knowledge can understand. The goal of this project is to present the information clearly, while also providing insights and advice on how individuals can improve their quality of sleep while lowering their stress levels. 



**Dataset**

The dataset used in this project contains information on 15,000 individuals. It includes variables such as daily screen time (in hours), sleep quality score, stress level, occupation, age, gender, caffeine intake, and physical activity. Many variables were utilized for the project, but not all of them were relevant or had significant impacts on the relationships between other variables. 



To simplify the analysis of the data, several variables were grouped into categories**.** Most variables that were group were placed into the following categories: low (under 3), medium (3-6), and high (over 6). For sleep quality, the groups were slightly different: low (under 6), medium (6-8), and high (over 8) in hours. 



The dataset was cleaned, and numeric fields were converted into the appropriate formats. 



The original dataset can be found here: https://www.kaggle.com/datasets/jayjoshi37/sleep-screen-time-and-stress-analysis	



The modified dataset can be found in this project's repository, titled "sleep.csv" 



**Design Process**

This project uses scrollytelling to advance. While the user scrolls up or down the webpage, the visualization and its accompanying text will be updated. This allows the user to go at their own pace, and travel through a narrative story instead of being overwhelmed with all of the information at once. 



Each of the five visualizations were chosen to display a relationship between variables: 

1. **Scatter Plot**
This was used to show the relationship between screen time and stress, at an individual level. This lets the user see trends and a variety of experiences from different people. 
2. **Line Chart**
This was used to show how sleep quality can change across screen time groups, emphasizing the importance of trends. 
3. **Heat Map**
This was used to show the effects of both screen time and sleep quality on stress levels. This highlights how multiple variables can interact with each other to impact people. 
4. **Lollipop Chart**
This was used to compare stress levels from individuals with different occupations. A lollipop chart was chosen for variety. Since the next chart is best presented as a grouped bar chart, a lollipop chart was used here to show the findings in an appealing way without being too similar to the other charts. 
5. **Grouped Bar Chart** 
This was used to compare sleep quality and screen time across different occupations, which allows for a side-by-side comparison of different occupations and other variables.  



The sections after the chart focus on summarizing the data and insights that were discovered while researching. Advice is also given. 



**Interaction and Features**

There are several interactive elements and features to help make the visualizations more engaging and easier to navigate. The scrollytelly aspect allows the user to scroll at their own pace. Mouseover tooltips were added to display specific, detailed values of dots and other items on graphs. Hover effects were added to show data points. Some transitions were animated between visualizations to be more appealing. Intersection observer was added to update the website's chart and text based on how far the user has scrolled. A sticky visualization panel was added to keep the chart container on the screen while the user is scrolling. 



**Key Insights**

There were several important findings that were discovered while going through the data and creating the visualizations:

* Screen time had the strongest relationship with both stress levels and sleep 
* A higher screen time is associated with higher stress levels
* As screen time increases, sleep quality decreases
* Individuals that have both higher screen time and lower sleep experience higher stress levels
* Age, gender, physical activity levels, and caffeine intake had minimal impacts on the three main factors
* Differences among occupations are small but noticeable 



**Challenges**

During the development of this project, several challenges were faced: 

* Constant troubleshooting for scrollytelling to ensure that the visualizations and their corresponding text were synced
* Debugging issues with visualizations rendering, since some charts did not load properly at first
* For some visualizations, their labels, legends and category names did not always fit in the container and constantly had to be resized 
* I wanted to add a visual for the introduction and other text-based sections that did not have charts. I created three drawings on Microsoft Paint to cycle through, but this required a lot of troubleshooting because the images did not load properly, so I had to make sure that the function was placed in the right part of the file. 
* Some chunks of code were placed in the wrong part of the file, due to my own error. I had to test chunks of code in different parts of the file to see where they would work, and where the code would break. 
* I constantly had to edit positioning and layout for text and visualization panels. I wanted the visuals on the left and text on the right, but some visualizations appeared on the right while the text appeared on the left. 



These challenges were solved through trial-and-error, constant troubleshooting, and debugging. 



**Iteration and Improvements**

There were several iterations of this project. The initial concept did not have a narrative, and just focused on conveying the data through visualizations. Scrollytelling was then implemented, along with text, to add a narrative aspect. As more visualizations were added, different aspects of them were modified, including margins and scaling, labels, legends (if necessary) and different color scaling. To provide more insight, additional text-based sections were added that detailed the key takeaways from this research, and advice on how the user can improve their habits. 



**Future Work**

This project can be expanded on. Each variable can be focused on, including age and gender. Some variables were excluded from this project because the results were not different enough to make a meaningful comparison, but these variables can be expanded on. Time-based data could be implemented to show how these trends have changed over time. Users could also be allowed to input their own data, and user data could be added to the dataset; or a new dataset of exclusively user data could be added. 



**Conclusion** 

This project demonstrates how data can be visualized to properly explore relationships between daily habits and overall well-being. The findings suggest that small changes in behavior, even if they seem insignificant, can lead to better habits and therefore more meaningful effects on someone's overall health. 

