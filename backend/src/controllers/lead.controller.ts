import { Request, Response } from "express";

import Lead from "../models/Lead.model";

export const createLead = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const lead = await Lead.create(req.body);

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create lead",
    });
  }
};

export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, source, search, sort = "latest", page = "1" } = req.query;

    const query: Record<string, unknown> = {};

    /*
      STATUS FILTER
    */
    if (status) {
      query.status = status;
    }

    /*
      SOURCE FILTER
    */
    if (source) {
      query.source = source;
    }

    /*
      SEARCH FILTER
      Search by:
      - name
      - email
    */
    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    /*
      SORTING
    */
    let sortOption = {};

    if (sort === "latest") {
      sortOption = { createdAt: -1 };
    }

    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    }

    /*
      PAGINATION
    */
    const pageNumber = parseInt(page as string) || 1;

    const limit = 10;

    const skip = (pageNumber - 1) * limit;

    /*
      TOTAL RECORDS
    */
    const totalRecords = await Lead.countDocuments(query);

    /*
      FETCH DATA
    */
    const leads = await Lead.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    /*
      TOTAL PAGES
    */
    const totalPages = Math.ceil(totalRecords / limit);

    res.status(200).json({
      success: true,

      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalRecords,
      },

      data: leads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch leads",
    });
  }
};

export const getLeadById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      res.status(404).json({
        success: false,
        message: "Lead not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch lead",
    });
  }
};

export const updateLead = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!lead) {
      res.status(404).json({
        success: false,
        message: "Lead not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update lead",
    });
  }
};

export const deleteLead = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      res.status(404).json({
        success: false,
        message: "Lead not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete lead",
    });
  }
};
