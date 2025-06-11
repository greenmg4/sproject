package com.example.demo.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GradeDiscDTO {
	//[박민혁]
	private String grade;
    private double disc_rate;
    private int disc_max_amt, stm_amt;
    
}
